const reflexes = $input.first().json?.data.response || []
const chatInput = $('Merge Trigger').first().json.chatInput || ''

const reflexesList = reflexes
  .map(
    (r) =>
      `## Reflex ${r.id} [${r.type}]

### Stimulus
${r.stimulus}

### Response
${r.response}

### Statistics
- **Effectiveness**: ${r.effectiveness ?? 'N/A'}
- **Execution Rate**: ${r.executionRate ?? 'N/A'}
`,
  )
  .join('\n---\n\n')

const systemMessage = `$systemMessageTemplate`

return [
  {
    json: {
      systemMessage,
      reflexes,
      reflexesList,
      chatInput,
    },
  },
]

