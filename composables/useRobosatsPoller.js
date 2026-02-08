import { useRobosatsStore } from '~/stores/robosats'

export const useRobosatsPoller = () => {
  const store = useRobosatsStore()
  const config = useRuntimeConfig()

  const pollContracts = async () => {
    for (const uuid of store.contractUuids) {
      try {
        const { data } = await $fetch(`/api/robosats/contracts/${uuid}`)
        if (data.value) {
          store.updateContract(uuid, data.value)
        }
      } catch (err) {
        console.error(`Failed to poll ${uuid}:`, err)
      }
    }
  }

  const startPolling = () => {
    setInterval(pollContracts, 10_000)
  }

  return { startPolling }
}
