import { readFileSync } from 'fs'
import { join } from 'path'
import { SkillManifest } from 'server/schema/types/Skills/interfaces'

export const skillManifest: SkillManifest = {
  name: 'Tasks',
  description: readFileSync(join(__dirname, 'description.md'), 'utf-8'),
  buildContent: async () => {
    return readFileSync(join(__dirname, 'content.md'), 'utf-8')
  },
  files: [],
}
