// server/api/robot.post.js
import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, pgpPublicKey, pgpPrivateKey, nostrPubkey } = body || {}

  if (!token || !pgpPublicKey || !pgpPrivateKey || !nostrPubkey) {
    return { error: 'Missing required fields' }
  }

  const authorizationHeader = `Token ${token} ^| Public ${pgpPublicKey} ^| Private ${pgpPrivateKey} ^| Nostr ${nostrPubkey}`

  try {
    const res = await got('http://mmhaqzuirth5rx7gl24d4773lknltjhik57k7ahec5iefktezv4b3uid.onion/api/robot/', {
      method: 'GET',
      headers: {
        Authorization: authorizationHeader
      },
      agent: {
        http: new SocksProxyAgent('socks5h://127.0.0.1:9050')
      },
      timeout: { request: 15000 }
    })

    console.log('Response:', res.body)
    return JSON.parse(res.body)
  } catch (err) {
    console.error('Request failed:', err)
    return {
      error: err.response?.body
        ? JSON.parse(err.response.body)
        : err.message
    }
  }
})
