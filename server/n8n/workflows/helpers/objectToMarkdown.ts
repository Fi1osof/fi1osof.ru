type T = Record<string, unknown> | object

export function objectToMarkdown(
  obj: T | Array<T>,
  name: string,
  level: number = 2,
): string {
  const headingLevel = Math.min(level, 6)
  const heading = '#'.repeat(headingLevel)

  if (obj === null || obj === undefined) {
    return `${heading} ${name}\n\n_empty_\n`
  }

  if (typeof obj !== 'object') {
    return `${heading} ${name}\n\n${String(obj)}\n`
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return `${heading} ${name}\n\n_empty array_\n`
    }

    const items = obj
      .map((item, index) => {
        if (typeof item === 'object' && item !== null) {
          return objectToMarkdown(item, `${name}[${index}]`, level + 1)
        }
        return `- ${String(item)}`
      })
      .join('\n')

    return `${heading} ${name}\n\n${items}\n`
  }

  const entries = Object.entries(obj as Record<string, unknown>)
  if (entries.length === 0) {
    return `${heading} ${name}\n\n_empty object_\n`
  }

  const lines: string[] = [`${heading} ${name}\n`]

  for (const [key, value] of entries) {
    if (typeof value === 'object' && value !== null) {
      lines.push(objectToMarkdown(value, key, level + 1))
    } else {
      lines.push(`- **${key}**: ${String(value)}`)
    }
  }

  return lines.join('\n') + '\n'
}
