export interface ToolCallRecord {
  timestamp: string
  workflowId: string
  agentId: string
  agentName: string
  sessionId: string
  toolName: string
  toolArguments: Record<string, unknown>
  toolResult: string
  userId?: string
}

export interface ToolCallsFilter {
  workflowId: string
  limit?: number
}

class ToolCallsMemoryStore {
  private records: Map<string, ToolCallRecord[]> = new Map()

  addToolCall(record: ToolCallRecord): void {
    const bucket = this.records.get(record.workflowId)
    if (bucket) {
      bucket.push(record)
    } else {
      this.records.set(record.workflowId, [record])
    }
  }

  getToolCalls(filter: ToolCallsFilter): ToolCallRecord[] {
    const bucket = this.records.get(filter.workflowId) ?? []

    if (filter.limit && filter.limit > 0) {
      return bucket.slice(-filter.limit)
    }

    return bucket
  }

  formatForSystemMessage(records: ToolCallRecord[]): string {
    if (records.length === 0) {
      return 'No tool calls found in history.'
    }

    return records
      .map((record, index) => {
        return `## Tool Call #${index + 1}
- **Time:** ${record.timestamp}
- **Agent:** ${record.agentName} (${record.agentId})
- **Session:** ${record.sessionId}
- **Tool:** ${record.toolName}
- **Arguments:** ${JSON.stringify(record.toolArguments)}
- **Result:**
${record.toolResult}
`
      })
      .join('\n')
  }

  getStats(): {
    totalRecords: number
    byWorkflow: Record<string, number>
  } {
    const byWorkflow: Record<string, number> = {}
    let totalRecords = 0

    for (const [workflowId, bucket] of this.records) {
      byWorkflow[workflowId] = bucket.length
      totalRecords += bucket.length
    }

    return { totalRecords, byWorkflow }
  }
}

export const toolCallsMemory = new ToolCallsMemoryStore()
