import { createHash } from 'crypto'
import * as openpgp from 'openpgp'
import { SocksProxyAgent } from 'socks-proxy-agent'
import got from 'got'

export default defineEventHandler(async (event) => {

  const { rawToken, base91Token } = await readBody(event)

  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'client', email: 'robot@example.com' }],
    passphrase: rawToken
  })

  const sha256 = createHash('sha256').update(rawToken).digest()

  const nostrPubkey = getNostrPublicKey(sha256)

  const authHeader =
    `Token ${base91Token} ^| Public ${publicKey} ^| Private ${privateKey} ^| Nostr ${nostrPubkey}`

  try {
    const res = await got('http://mmhaqzuirth5rx7gl24d4773lknltjhik57k7ahec5iefktezv4b3uid.onion/api/robot/', {
      method: 'GET',
      headers: { Authorization: authHeader },
      agent: { http: new SocksProxyAgent('socks5h://127.0.0.1:9050') },
      throwHttpErrors: false
    })

    return JSON.parse(res.body)
  } catch (err) {
    return { error: 'Request failed', details: err.message }
  }
})
