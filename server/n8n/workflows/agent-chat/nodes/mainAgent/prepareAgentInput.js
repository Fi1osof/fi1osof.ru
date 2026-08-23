// Merge Agents collects results from decompositor and useful-info agents as separate items

const mainContext = $('Prepare Context').first().json

const [decompositorItem, agentDataItem, usefulInfoItem] = $input.all()

const { agentData } = agentDataItem?.json || {}
const usefulInfoData = usefulInfoItem?.json || {}
const {
  user,
  output: decompositorOutput = '',
  assistantMessages = [],
  triggerData,
  ...other
} = decompositorItem?.json || {}

const {
  chatInput,
  sessionId: _sessionId,
  token: _token,
  ...requestParams
} = triggerData || {}

// Validate input prompt length
const MAX_PROMPT_LENGTH = 10000

if (chatInput && chatInput.length > MAX_PROMPT_LENGTH) {
  throw new Error(
    `Input prompt exceeds maximum allowed length of ${MAX_PROMPT_LENGTH} characters. Current length: ${chatInput.length}`,
  )
}

const usefulInfoOutput = usefulInfoData.output || ''

const combinedAssistantMessages = [...assistantMessages]

if (agentData) {
  combinedAssistantMessages.push({
    role: 'assistant',
    content: `## The following is your agent profile data. This information defines who you are, your capabilities, and your role. Use it to guide your behavior and responses.

    ### Your profile
 
    ${JSON.stringify(agentData, null, 2)}`,
  })
}

// Build system message with analysis results
if (decompositorOutput || usefulInfoOutput) {
  if (decompositorOutput) {
    combinedAssistantMessages.push({
      role: 'assistant',
      content: `## Decompositor Analysis\n\n${decompositorOutput}\n\n`,
    })
  }

  if (usefulInfoOutput) {
    combinedAssistantMessages.push({
      role: 'assistant',
      content: `## Useful Context\n\n${usefulInfoOutput}\n\n`,
    })
  }
}

if (user) {
  combinedAssistantMessages.push({
    role: 'assistant',
    content: `## User profile info
 
    ${JSON.stringify(user, null, 2)}`,
  })
} else {
  combinedAssistantMessages.push({
    role: 'assistant',
    content: `## User unauthorized
    `,
  })
}

if (requestParams && Object.keys(requestParams).length > 0) {
  combinedAssistantMessages.push({
    role: 'assistant',
    content: `## Request params
${JSON.stringify(requestParams)}
    `,
  })
}

return {
  ...other,
  assistantMessages: combinedAssistantMessages,
  enableStreaming: mainContext.enableStreaming,
}
