/**
 * Simple runtime template engine: substitutes `{{path.to.value}}` from vars.
 * Missing and unknown keys are replaced with an empty string.
 */
export function renderTemplate(
  template: string,
  vars: Record<string, unknown> = {},
): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    const value = path
      .split('.')
      .reduce<unknown>(
        (acc, key) =>
          acc !== null && typeof acc === 'object'
            ? (acc as Record<string, unknown>)[key]
            : undefined,
        vars,
      )

    if (value === null) {
      return ''
    }

    if (typeof value === 'string') {
      return value
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }

    return JSON.stringify(value)
  })
}
