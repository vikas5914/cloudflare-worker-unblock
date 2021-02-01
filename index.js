/**
 * Example baseHost at host is set up to respond with HTML
 * Replace url with the host you wish to send requests to
 */
const baseHost = 'https://example.com/'

/**
 * gatherResponse awaits and returns a response body with appropriate headers.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse (response) {
  const { headers } = response

  return {
    body: await response.body,
    extra: {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    }
  }
}

async function handleRequest (request) {
  const requestUrl = new URL(request.url)

  const proxyRequest = new Request(baseHost + requestUrl.pathname + requestUrl.search, {
    method: request.method,
    headers: request.headers,
    cf: {
      cacheTtl: 10,
      cacheEverything: true
    }
  })

  const response = await fetch(proxyRequest)
  const results = await gatherResponse(response)
  return new Response(results.body, results.extra)
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
})
