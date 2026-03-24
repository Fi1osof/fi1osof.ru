const [decompositorInputs, agentWorld, mindLogs] = $input.all()

return [
  {
    json: {
      ...decompositorInputs.json,
      enableStreaming: false,
      agentWorld: {
        json: agentWorld.json,
      },
      mindLogs: {
        json: mindLogs.json,
      },
    },
  },
]
