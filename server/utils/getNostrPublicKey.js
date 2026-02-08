import { getPublicKey } from '@noble/secp256k1'
import { createHash } from 'crypto'

export function getNostrPublicKey(token) {
  // 1. SHA-256 hash of the token
  const hash = createHash('sha256').update(token).digest()
  
  // 2. Get compressed public key (33 bytes)
  const pubkey = getPublicKey(hash, true) // compressed = true

  // 3. Return hex-encoded public key
  return Buffer.from(pubkey).toString('hex')
}
