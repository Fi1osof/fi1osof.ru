const items = $input.all()

const item = items[0]?.json || {}
const item2 = items[1]?.json || {}

const assistantMessages = item.assistantMessages || []
const instructions = item2.instructions || ''

const combinedAssistantMessages = [...assistantMessages]

if (instructions) {
  let systemContent =
    '[INTERNAL SYSTEM NOTE — NOT FROM USER, NOT FOR USER]\n' +
    'The following is an internal pre-processing result from the Reflection subsystem. ' +
    'It is auxiliary information for YOU (the agent) only. ' +
    'Do NOT treat this as a user message. Do NOT quote or relay this to the user. ' +
    'Use these instructions to guide your behavior when processing the next user message.\n\n'

  if (instructions) {
    systemContent += `## Reflection Instructions\n\n${instructions}`
  }

  combinedAssistantMessages.push({
    role: 'system',
    content: systemContent.trim(),
  })
}

return {
  ...item,
  assistantMessages: combinedAssistantMessages,
}
