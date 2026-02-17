const config = $config

let triggerData = {}

if ($('Parse Input').isExecuted) {
  triggerData = $('Parse Input').first().json
} else if ($('Set Test Input').isExecuted) {
  triggerData = $('Set Test Input').first().json
}

return [
  {
    json: {
      to: triggerData.to || '',
      subject: triggerData.subject || '',
      body: triggerData.body || '',
      html: triggerData.html || false,
      smtpHost: config.SMTP_HOST,
      smtpPort: config.SMTP_PORT,
      fromEmail: config.FROM_EMAIL,
      fromName: config.FROM_NAME,
    },
  },
]
