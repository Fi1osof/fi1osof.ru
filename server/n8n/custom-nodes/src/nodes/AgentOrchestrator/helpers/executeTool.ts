import { ExecuteContext, ToolCall } from './types'

export const executeTool = async (
  ctx: ExecuteContext,
  toolCall: ToolCall,
  debugLog?: (msg: string) => void,
): Promise<string> => {
  const log =
    debugLog ??
    function noop(): void {
      return
    }

  try {
    const connectedTools = await ctx.getInputConnectionData('ai_tool', 0)

    if (!connectedTools) {
      log(`executeTool: No connected tools found`)
      return `Tool ${toolCall.name} not found - no tools connected`
    }

    const toolsArray = Array.isArray(connectedTools)
      ? connectedTools
      : [connectedTools]

    const tool = toolsArray.find(
      (t: { name?: string }) => t.name === toolCall.name,
    ) as
      | {
          name?: string
          invoke?: (args: Record<string, unknown>) => Promise<string>
        }
      | undefined

    if (!tool) {
      log(`executeTool: Tool ${toolCall.name} not found in connected tools`)
      return `Tool ${toolCall.name} not found in available tools`
    }

    if (tool.invoke) {
      const result = await tool.invoke(toolCall.arguments)
      log(`executeTool: ${toolCall.name} returned: ${result}`)
      return result
    }

    log(`executeTool: Tool ${toolCall.name} has no invoke method`)
    return `Tool ${toolCall.name} has no invoke method`
  } catch (e: unknown) {
    const errorMsg = (e as Error).message
    log(`executeTool: Error executing ${toolCall.name}: ${errorMsg}`)
    return `Tool error: ${errorMsg}`
  }
}
