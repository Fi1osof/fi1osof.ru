import { readFileSync } from 'fs'
import { join } from 'path'
import { SkillManifest } from '../../interfaces'
import { renderTemplate } from '../../renderTemplate'

const descriptionTemplate = readFileSync(
  join(__dirname, 'description.md'),
  'utf-8',
)

export const skillManifest: SkillManifest = {
  name: 'Hello, world',
  description: 'Demo skill: echo call and dynamic data from the database.',
  files: ['description.md', 'run.sh'],
  executable: {
    type: 'shell',
    command: 'run.sh',
    argsSchema: {
      message: 'string',
    },
  },
  buildContent: async (ctx) => {
    const userCount = await ctx.prisma.user.count()
    return renderTemplate(descriptionTemplate, {
      userCount,
      now: new Date().toISOString(),
    })
  },
}
