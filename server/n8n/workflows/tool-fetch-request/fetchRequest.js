// eslint-disable-next-line @typescript-eslint/no-require-imports, no-redeclare
const fetch = require('node-fetch')
const input = $input.first().json

const url = input.url
const method = (input.method || 'GET').toUpperCase()

const headers =
  typeof input.headers === 'string' && input.headers
    ? JSON.parse(input.headers)
    : input.headers || {}

const body =
  typeof input.body === 'string' && input.body
    ? JSON.parse(input.body)
    : input.body || null

const options = {
  method,
  headers,
}

if (body && method !== 'GET' && method !== 'HEAD') {
  if (!headers['Content-Type'] && !headers['content-type']) {
    options.headers['Content-Type'] = 'application/json'
  }
  options.body = JSON.stringify(body)
}

const response = await fetch(url, options)

let data
const contentType = response.headers.get('content-type') || ''
if (contentType.includes('application/json')) {
  data = await response.json()
} else {
  data = await response.text()
}

return [
  {
    json: {
      statusCode: response.status,
      statusMessage: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: data,
    },
  },
]
