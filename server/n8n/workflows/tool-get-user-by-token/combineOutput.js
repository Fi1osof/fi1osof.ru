const user = $('Merge Results').first().json.user || null
const sessionId = $('Merge Results').first().json.sessionId || ''
const worldUser = $json.user || null

return [
  {
    json: {
      user,
      sessionId,
      worldData: { user: worldUser },
    },
  },
]
