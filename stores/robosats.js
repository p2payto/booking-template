import { defineStore } from 'pinia'
import persistedState from 'pinia-plugin-persistedstate'

export const useRobosatsStore = defineStore('robosats', {
  state: () => ({
    contractUuids: [],
    contracts: {} // key: uuid, value: full contract data
  }),

  actions: {
    addContract(uuid) {
      if (!this.contractUuids.includes(uuid)) {
        this.contractUuids.push(uuid)
      }
    },
    updateContract(uuid, data) {
      this.contracts[uuid] = data
    },
    removeContract(uuid) {
      this.contractUuids = this.contractUuids.filter(id => id !== uuid)
      delete this.contracts[uuid]
    }
  },

  persist: {
    storage: persistedState.localStorage,
    key: 'robosats',
  }
})
