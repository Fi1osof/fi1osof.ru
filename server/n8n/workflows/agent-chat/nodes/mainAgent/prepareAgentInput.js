// Merge Agents collects results from decompositor and useful-info agents as separate items

const mainContext = $('Prepare Context').first().json

const [decompositorItem, agentDataItem, usefulInfoItem] = $input.all()

const { agentData } = agentDataItem?.json || {}
const usefulInfoData = usefulInfoItem?.json || {}
const {
  user,
  output: decompositorOutput = '',
  assistantMessages = [],
  ...other
} = decompositorItem?.json || {}

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

// eslint-disable-next-line no-console
console.log('user', user)

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

return {
  ...other,
  assistantMessages: combinedAssistantMessages,
  enableStreaming: mainContext.enableStreaming,
}
