import { readBody, getQuery } from 'h3'
import { ofetch } from 'ofetch'
import { defaultLocale } from '~/assets/js/locales'

const {
  btcpayApikey,
  public: {
    isDev
    // NOTE: deploymentDomain should NOT be used for server-side internal fetches
    // deploymentDomain
  }
} = useRuntimeConfig()

// Wrapper for the BTCPay Greenfield API fetch
export const greenfieldApi = async (endpoint, event) => {
  // NOTE: Do NOT call Nuxt Content using an absolute domain here.
  // In production (DO), the old domain may not resolve from inside the container.
  // Use a relative path so Nitro handles it internally.
  const params = encodeURIComponent(JSON.stringify({
    where: [{
      _partial: false,
      _locale: defaultLocale,
      _path: '/settings',
      _dir: ''
    }]
  }))

  const [{
    btcpay: { storeid, host }
  }] = await ofetch(`/api/_content/query?_params=${params}`)

  const apiFetch = ofetch.create({
    baseURL: `${host}/api/v1/stores/${storeid}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${btcpayApikey}`
    },
    redirect: 'follow',
    async onRequestError({ request, error }) {
      if (isDev) console.log('[fetch request error]', request, error)
    },
    async onResponseError({ request, response }) {
      if (isDev) console.log('[fetch response error]', request, response.status, response.body)
    }
  })

  const method = event.method
  const query = getQuery(event)

  let body
  if (method !== 'GET') {
    body = await readBody(event)
  }

  return await apiFetch(endpoint, { method, query, body })
}
