import { existsSync, readdirSync, statSync } from 'fs'
import { dirname, join, relative, sep } from 'path'
import { RegisteredSkill, SkillManifest } from './interfaces'

const SKILLS_DIR = join(__dirname, '../')

/**
 * В прод-режиме в бандл собираются js-файлы, а не ts,
 * поэтому прописываем вариант и с .js
 */
const SKILL_FILE_NAMES = ['skillManifest.ts', 'skillManifest.js']

function findSkillFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return []
  }
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      out.push(...findSkillFiles(full))
    } else if (SKILL_FILE_NAMES.includes(entry)) {
      out.push(full)
    }
  }
  return out
}

function loadSkill(file: string): RegisteredSkill | undefined {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { skillManifest } = require(file) as { skillManifest?: SkillManifest }

  if (!skillManifest || !skillManifest.name) {
    if (process.env.NODE_ENV === 'development') {
      console.error(new Error(`Invalid skill manifest in ${file}`))
    }

    return
  }

  const skillDir = dirname(file)
  const id = relative(SKILLS_DIR, skillDir).split(sep).join('/')
  if (!id) {
    throw new Error(
      `Skill file must live in a subdirectory of skills/: ${file}`,
    )
  }
  return { ...skillManifest, id, __dir: skillDir }
}

const SKILLS: RegisteredSkill[] = findSkillFiles(SKILLS_DIR)
  .map(loadSkill)
  .filter((n) => !!n)

const skillsById = new Map<string, RegisteredSkill>(
  SKILLS.map((skill) => [skill.id, skill]),
)

if (skillsById.size !== SKILLS.length) {
  throw new Error('Duplicate skill id detected in registry')
}

export function listSkills(): RegisteredSkill[] {
  return SKILLS
}

export function getSkill(id: string): RegisteredSkill | undefined {
  return skillsById.get(id)
}
