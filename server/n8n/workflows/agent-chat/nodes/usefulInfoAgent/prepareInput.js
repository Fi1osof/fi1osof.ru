const [decompositorInputs, agentWorld, mindLogs, agentWorldUserObject] =
  // @ts-expect-error types
  $input.all()

const _agentWorldData = agentWorld?.json || {}
const mindLogsData = mindLogs?.json?.data?.response || []

const userNode = agentWorldUserObject?.json.worldData.user

/**
 * Format conversations
 * @param {WorldNode | null} userNode
 * @returns {string | null}
 */
function formatConversations(userNode) {
  const conversationsNode = userNode?.children?.find(
    (c) => c.type === 'conversations',
  )

  if (!conversationsNode?.children?.length) {
    return null
  }

  return conversationsNode.children
    .map((conv, i) => {
      const content = conv.data?.content || ''
      if (!content) {
        return null
      }
      const createdAt = conv.meta?.createdAt || ''
      const responses =
        conv.children
          ?.map((r) => {
            const respContent = r.data?.content || ''
            const respCreatedAt = r.meta?.createdAt || ''
            return respContent
              ? `  - Response${respCreatedAt ? ` (${respCreatedAt})` : ''}: ${respContent}`
              : null
          })
          .filter(Boolean)
          .join('\n') || ''
      return `${i + 1}. ${createdAt ? `[${createdAt}] ` : ''}${content}${responses ? '\n' + responses : ''}`
    })
    .filter(Boolean)
    .join('\n\n')
}

/**
 * Format mindLogs
 * @param {MindLog[]} logs
 * @returns {string | null}
 */
function formatMindLogs(logs) {
  if (!logs?.length) {
    return null
  }

  return logs
    .map((log) => {
      const type = log.type || ''
      const content = log.data
      if (!content) {
        return null
      }
      return `#### [${type}] ${log.updatedAt}

${content}`
    })
    .join('\n\n')
}

// Collect sections only if there is data
const sections = []

if (userNode) {
  const conversations = formatConversations(userNode)

  if (conversations) {
    sections.push(`### Conversation History\n${conversations}`)
  }
}

// MindLogs
const mindLogsFormatted = formatMindLogs(mindLogsData)
if (mindLogsFormatted) {
  sections.push(`### MindLogs\n${mindLogsFormatted}`)
}

const sectionsData = sections.length ? sections.join('\n\n') : ''

// @ts-expect-error types
return [
  {
    json: {
      ...decompositorInputs.json,
      enableStreaming: false,
      chatInput: sectionsData ? decompositorInputs.json.chatInput : null,
      assistantMessages: [
        {
          role: 'assistant',
          content: `## System data to analyze for useful information related to the request

  ${sectionsData}
`,
        },
      ],
    },
  },
]
