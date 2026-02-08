export default defineEventHandler(async (event) => {

  return await robosatsRequest({
    method: 'GET',
    path: '/api/robot/'
  })
})
