const input = $input.first().json
return [
  {
    json: {
      ...input,
      headers: JSON.stringify(
        typeof input.headers === 'string' && input.headers
          ? JSON.parse(input.headers)
          : input.headers || {},
      ),
      body: JSON.stringify(
        typeof input.body === 'string' && input.body
          ? JSON.parse(input.body)
          : input.body || {},
      ),
    },
  },
]
