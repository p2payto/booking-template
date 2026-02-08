<script setup>

const token = ref('')
const pgpPublicKey = ref('')
const pgpPrivateKey = ref('')
const nostrPubkey = ref('')
const apiResponse = ref(null)
const loading = ref(false)

async function generateIdentity() {
  loading.value = true
  try {
    const res = await $fetch('/api/robosats/identity')
    token.value = res.token
    pgpPublicKey.value = res.pgpPublicKey
    pgpPrivateKey.value = res.pgpPrivateKey
    nostrPubkey.value = res.nostrPubkey

    // Now make the actual RoboSats request
    const response = await $fetch('/api/robosats/robot', {
      method: 'POST',
      body: {
        token: token.value,
        pgpPublicKey: pgpPublicKey.value,
        pgpPrivateKey: pgpPrivateKey.value,
        nostrPubkey: nostrPubkey.value
      }
    })

    apiResponse.value = response
    console.log('RoboSats API response:', response)
  } catch (err) {
    console.error('Failed to generate robot identity:', err)
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <NuxtLayout>
    <section class="section is-medium">
      <div class="buttons">
        <button class="button is-primary" @click="generateIdentity">
          {{ loading ? 'Loading...' : 'Generate Robot Identity' }}
        </button>
      </div>

      <div v-if="token" class="content">
        <p><strong>Token:</strong> {{ token }}</p>
        <p><strong>Nostr Pubkey:</strong> {{ nostrPubkey }}</p>
        <p><strong>PGP Public Key:</strong></p>
        <pre>{{ pgpPublicKey }}</pre>
        <p><strong>PGP Private Key:</strong></p>
        <pre>{{ pgpPrivateKey }}</pre>
      </div>

      <div v-if="robotResponse" class="content">
        <h3 class="title is-5">RoboSats API Response:</h3>
        <pre>{{ robotResponse }}</pre>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.section {
  padding-top: 2rem;
}
pre {
  background: #2e2e2e;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
