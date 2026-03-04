const input = $input.first().json

return [
  {
    json: {
      to: input.to || '',
      subject: input.subject || '',
      body: input.body || '',
      html: input.html || false,
    },
  },
]
