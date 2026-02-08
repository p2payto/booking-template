<script setup>
import { useNostrStore } from '@/stores/nostr'

onMounted(() => {
  const nostr = useNostrStore()
  const { startPolling } = useRobosatsPoller()
  nostr.init()
  startPolling()
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

