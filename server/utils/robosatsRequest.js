import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { randomBytes, createHash } from 'crypto'
import { Base91, Base16 } from 'base-ex'
import * as openpgp from 'openpgp'

const { public: { robosatsUrl } } = useRuntimeConfig()

const b91 = new Base91()
const b16 = new Base16()

function escapeHeaderValue(str) {
  return str
    .replace(/\\/g, '\\\\')  // double backslashes
    .replace(/\n/g, '\\n')       // escape literal \n
    .replace(/\r/g, '')
    .replace(/\"/g, '\\"')
}

export const robosatsRequest = async ({ method, path, body }) => {

  const url = `${robosatsUrl}${path}`

  const rawToken = randomBytes(32)
  const sha256 = createHash('sha256').update(rawToken).digest('hex')
  const base91Token = b91.encode(b16.decode(sha256))

  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'robosats', email: 'robot@example.com' }],
    passphrase: rawToken.toString('hex')
  })

  const nostrPubkey = getNostrPublicKey(Buffer.from(sha256, 'hex'))

  const authHeader = `Token ${base91Token} ^| Public ${escapeHeaderValue(publicKey)} ^| Private ${escapeHeaderValue(privateKey)} ^| Nostr ${nostrPubkey}`

  console.log('Base91:', base91Token)
  console.log('Length:', base91Token.length)
  console.log('authHeader (preview):', authHeader.slice(0, 150) + '...')

  const headers = {
    Authorization: authHeader,
    ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {})
  }

  const res = await got(url, {
    method,
    headers,
    agent: {
      http: new SocksProxyAgent('socks5h://127.0.0.1:9050')
    },
    body: method === 'POST' && body ? JSON.stringify(body) : undefined,
    throwHttpErrors: false
  })

  try {
    return JSON.parse(res.body)
  } catch (err) {
    return { error: 'Invalid JSON', raw: res.body }
  }
}
