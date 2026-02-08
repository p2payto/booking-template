export default defineEventHandler(async (event) => {
  const { amount, currency, paymentMethods, sk } = await readBody(event)

  const currencies = getCurrencies();
  const currencyIndex = currencies[currency];

  return await robosatsRequest({
    method: 'POST',
    path: '/api/make/',
    sk,
    body: {
      type: 0,
      amount,
      fiatCurrencyId,
      paymentMethodId,
      premium: 0,
      minReputation: 0,
      verifiedOnly: false,
      strictFiat: false,
      selfCustody: true,
      pgp_public_key: ''
    }
  })
})
