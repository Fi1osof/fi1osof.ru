import { builder } from 'server/schema/builder'
import { SkillExecutionResultType } from '../types'
import { getSkill } from '../registry'
import { runSkillExecutable } from '../executor'
import { SkillExecutionResult } from '../interfaces'

builder.mutationField('executeSkill', (t) =>
  t.field({
    type: SkillExecutionResultType,
    nullable: false,
    args: {
      id: t.arg.id({ required: true }),
      args: t.arg({ type: 'Json', required: false }),
    },
    resolve: async (_root, args): Promise<SkillExecutionResult> => {
      const skill = getSkill(args.id)
      if (!skill) {
        throw new Error(`Skill "${args.id}" not found`)
      }
      if (!skill.executable) {
        throw new Error(`Skill "${skill.id}" is not executable`)
      }

      const rawArgs =
        args.args && typeof args.args === 'object'
          ? (args.args as Record<string, unknown>)
          : {}

      return runSkillExecutable(skill, rawArgs)
    },
  }),
)
