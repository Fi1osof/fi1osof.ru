const items = $input.all()
const firstItem = items[0]?.json || {}

let triggerData = {}

// isExecuted is a valid boolean property in n8n runtime, n8n UI type error is incorrect
const triggeredNode = $('Execute Workflow Trigger').isExecuted
  ? 'Execute Workflow Trigger'
  : $('Webhook Trigger').isExecuted
    ? 'Webhook Trigger'
    : 'When chat message received'

switch (triggeredNode) {
  case 'Webhook Trigger':
    triggerData = $('Webhook Prepare Input').first().json
    break
  case 'When chat message received':
    triggerData = $('When chat message received').first().json
    break
  default:
    throw new Error('Unhandled triggeredNode')
}

return [
  {
    json: {
      chatInput: triggerData.chatInput,
      sessionId: triggerData.sessionId,
      user: firstItem.user,
    },
  },
]
