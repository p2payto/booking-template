import { base91 } from '@/server/utils/base91'
import * as openpgp from 'openpgp'
import { sha256 } from 'ohash'

export async function useRobotToken() {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32))
  const token = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('')
  const tokenHash = await crypto.subtle.digest('SHA-256', tokenBytes)
  const base91Token = base91.encode(new Uint8Array(tokenHash))

  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'robosats', email: 'robot@example.com' }],
    format: 'armored',
    passphrase: base91Token
  })

  const nostrHex = Buffer.from(sha256(tokenBytes)).toString('hex')

  return {
    token,
    base91Token,
    pgpPublicKey: publicKey,
    pgpPrivateKey: privateKey,
    nostrPubkey: nostrHex
  }
}
