// ~/composables/useRobotIdentity.js
import { Base91 } from 'base-ex'
import { createHash } from 'crypto-browserify'
import * as openpgp from 'openpgp'

export const useRobotIdentity = async () => {
  // 1. Generate raw token (32 bytes)
  const rawToken = crypto.getRandomValues(new Uint8Array(32))

  // 2. Encode in Base91
  const base91 = new Base91()
  const base91Token = base91.encode(rawToken)

  // 3. SHA256 of Base91 token (hex string)
  const nostrPubkey = createHash('sha256').update(base91Token).digest('hex')

  // 4. Generate ephemeral OpenPGP key pair
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'robosats', email: 'robot@example.com' }],
    passphrase: base91Token
  })

  return {
    base91Token,
    nostrPubkey,
    publicKey,
    privateKey
  }
}