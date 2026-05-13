import { spawn } from 'child_process'
import { join } from 'path'
import {
  RegisteredSkill,
  SkillExecutable,
  SkillExecutionResult,
} from './interfaces'

const DEFAULT_TIMEOUT_MS = 60_000

function buildArgList(
  executable: SkillExecutable,
  args: Record<string, unknown>,
): string[] {
  const schema = executable.argsSchema ?? {}
  const out: string[] = []
  for (const key of Object.keys(schema)) {
    if (!(key in args)) {
      continue
    }
    const value = args[key]
    if (value === null) {
      continue
    }
    out.push(`--${key}`, String(value))
  }
  return out
}

/**
 * TODO (audit): execution runs on the server host. Later will be moved to
 * an isolated docker service (see task 001--docker-service).
 */
export async function runSkillExecutable(
  skill: RegisteredSkill,
  args: Record<string, unknown>,
): Promise<SkillExecutionResult> {
  if (!skill.executable) {
    throw new Error(`Skill "${skill.id}" has no executable`)
  }

  const executable = skill.executable
  const cwd = skill.__dir
  const fullPath = join(cwd, executable.command)
  const argList = buildArgList(executable, args)

  const [cmd, baseArgs] =
    executable.type === 'node' ? ['node', [fullPath]] : ['sh', [fullPath]]

  const startedAt = Date.now()

  return await new Promise<SkillExecutionResult>((resolve) => {
    const child = spawn(cmd, [...baseArgs, ...argList], {
      cwd,
      env: process.env,
    })

    let stdout = ''
    let stderr = ''
    let settled = false

    const timer = setTimeout(() => {
      if (settled) {
        return
      }
      settled = true
      child.kill('SIGKILL')
      resolve({
        stdout,
        stderr: stderr + `\n[skill] timeout after ${DEFAULT_TIMEOUT_MS}ms`,
        exitCode: 124,
        durationMs: Date.now() - startedAt,
      })
    }, DEFAULT_TIMEOUT_MS)

    child.stdout?.on('data', (chunk) => {
      stdout += chunk.toString()
    })
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString()
    })
    child.on('error', (err) => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      resolve({
        stdout,
        stderr: stderr + `\n[skill] spawn error: ${err.message}`,
        exitCode: -1,
        durationMs: Date.now() - startedAt,
      })
    })
    child.on('close', (code) => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timer)
      resolve({
        stdout,
        stderr,
        exitCode: code ?? -1,
        durationMs: Date.now() - startedAt,
      })
    })
  })
}
