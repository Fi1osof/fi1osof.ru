const items = $input.all()

const agentData = items[0]?.json
const user = agentData?.data?.me || null

const emailItem = $('Email Trigger').first()
const email = emailItem?.json || {}

const from = email.from?.text || email.from || 'Unknown sender'
const subject = email.subject || '(No subject)'
const text = email.text || email.textPlain || ''
const date = email.date || new Date().toISOString()

const chatInput = `New email received:
From: ${from}
Subject: ${subject}
Date: ${date}

${text}`

return {
  json: {
    chatInput,
    user,
  },
}
