const input = $input.first().json
const chatInput = input.chatInput || ''
const sessionId = input.sessionId || ''
const userId = input.userId || ''

return [
  {
    json: {
      ...input,
      chatInput,
      sessionId,
      userId,
    },
  },
]
