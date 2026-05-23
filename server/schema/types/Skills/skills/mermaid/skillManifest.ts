import { readFileSync } from 'fs'
import { join } from 'path'
import { SkillManifest } from '../../interfaces'

export const skillManifest: SkillManifest = {
  name: 'Mermaid Diagrams',
  description: readFileSync(join(__dirname, 'description.md'), 'utf-8'),
  buildContent: async () => {
    return readFileSync(join(__dirname, 'content.md'), 'utf-8')
  },
  files: [],
}
