const items = $input.all()
return items.map((item) => {
  const raw = item.json || {}
  const command = typeof raw.command === 'string' ? raw.command.trim() : ''
  if (!command) {
    throw new Error(
      'Parameter `command` is required and must be a non-empty string',
    )
  }
  const cwd = typeof raw.cwd === 'string' ? raw.cwd.trim() : ''
  let finalCommand = command
  if (cwd) {
    const escapedCwd = cwd.replace(/'/g, "'\\''")
    finalCommand = `cd '${escapedCwd}' && ${command}`
  }
  return { json: { ...raw, command: finalCommand } }
})
