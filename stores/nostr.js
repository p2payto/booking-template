import { defineStore } from 'pinia'
import { getPublicKey } from '@noble/secp256k1'
import { randomBytes, bytesToHex } from '@noble/hashes/utils'

export const useNostrStore = defineStore('nostr', {
  state: () => ({
    sk: null,
    pk: null
  }),

  actions: {
    init() {
      if (!this.sk) {
        const sk = bytesToHex(randomBytes(32))
        const pk = getPublicKey(sk)
        this.sk = sk
        this.pk = pk
      }
    },
    setKeyPair(sk) {
      this.sk = sk
      this.pk = getPublicKey(sk)
    }
  },

  persist: true
})
