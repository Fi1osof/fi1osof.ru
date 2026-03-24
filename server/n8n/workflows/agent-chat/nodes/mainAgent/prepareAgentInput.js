// Merge Agents collects results from decompositor and useful-info agents as separate items

const mainContext = $('Prepare Context').first().json

const [decompositorItem, usefulInfoItem] = $input.all()

const decompositorData = decompositorItem?.json || {}
const usefulInfoData = usefulInfoItem?.json || {}

// Data from decompositor agent (output contains instructions)
const decompositorOutput = decompositorData.output || ''

// Data from useful-info agent (if available)
const usefulInfoOutput = usefulInfoData.output || ''

const assistantMessages = decompositorData.assistantMessages || []
const combinedAssistantMessages = [...assistantMessages]

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

return {
  ...decompositorData,
  assistantMessages: combinedAssistantMessages,
  enableStreaming: mainContext.enableStreaming,
}
