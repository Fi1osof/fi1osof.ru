import { PrismaContext } from 'server/context/interfaces'

export type SkillArgPrimitive = 'string' | 'number' | 'boolean'

export interface SkillExecutable {
  type: 'shell' | 'node'
  /** Path to the executable file relative to the skill folder. */
  command: string
  /** Description of expected arguments; used for basic validation. */
  argsSchema?: Record<string, SkillArgPrimitive>
}

/**
 * Skill manifest written by the author in the skill.ts file.
 * id and absolute path are assigned automatically by the registry.
 */
export interface SkillManifest {
  name: string
  description: string
  /**
   * Optional builder for extended description. Can query the DB via
   * ctx and substitute any dynamic data. Returns a string (markdown).
   */
  buildContent: (ctx: PrismaContext) => Promise<string> | string
  /**
   * List of paths to auxiliary files relative to the skill folder
   * (for display in the detailed card).
   */
  files?: string[]
  executable?: SkillExecutable
}

/**
 * Skill after registration: id = path to folder relative to `skills/` (POSIX),
 * __dir = absolute path to the skill folder.
 */
export interface RegisteredSkill extends SkillManifest {
  id: string
  __dir: string
}

export interface SkillExecutionResult {
  stdout: string
  stderr: string
  exitCode: number
  durationMs: number
}
