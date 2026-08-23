import { PrismaClient, SystemLogLevel } from '@prisma/client'

export async function findOrCreateIncident(
  prisma: PrismaClient,
  params: {
    path?: string | null
    message: string
    level: SystemLogLevel
    statusCode?: number | null
  },
): Promise<string | null> {
  const { path, message, level, statusCode } = params

  // Search for open incidents with patterns
  const openIncidents = await prisma.incident.findMany({
    where: {
      status: 'open',
      pattern: { not: null },
    },
    orderBy: { createdAt: 'asc' },
  })

  // Check match with existing incidents
  for (const incident of openIncidents) {
    if (!incident.pattern) {
      continue
    }

    let matches = false

    switch (incident.patternType) {
      case 'exact':
        matches = path === incident.pattern || message === incident.pattern
        break

      case 'prefix':
        matches =
          (path?.startsWith(incident.pattern) ?? false) ||
          message.startsWith(incident.pattern)
        break

      case 'regex':
        try {
          const regex = new RegExp(incident.pattern)
          matches = regex.test(path || '') || regex.test(message)
        } catch {
          // Invalid regex
        }
        break
    }

    if (matches) {
      return incident.id
    }
  }

  // For errors, create a new incident automatically
  if (level === 'error') {
    // Generate pattern based on path or message
    let pattern: string | null = null
    let patternType: 'exact' | 'prefix' | 'regex' | null = null

    if (path && statusCode) {
      // For HTTP errors - pattern by path
      pattern = path
      patternType = 'exact'
    } else if (message) {
      // For JS errors - first line of message
      const firstLine = message.split('\n')[0].trim()
      if (firstLine.length > 10) {
        pattern = firstLine
        patternType = 'exact'
      }
    }

    const title = statusCode
      ? `HTTP ${statusCode}: ${path || 'Unknown path'}`
      : message.split('\n')[0].slice(0, 100)

    const incident = await prisma.incident.create({
      data: {
        title,
        pattern,
        patternType,
        status: 'open',
      },
    })

    return incident.id
  }

  return null
}
