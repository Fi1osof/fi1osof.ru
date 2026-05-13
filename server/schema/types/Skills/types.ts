import { builder } from 'server/schema/builder'
import { RegisteredSkill } from './interfaces'

export const Skill = builder.objectRef<RegisteredSkill>('Skill').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    content: t.string({
      nullable: true,
      resolve: async (skill, _args, ctx) =>
        skill.buildContent ? await skill.buildContent(ctx) : null,
    }),
    files: t.stringList({
      nullable: false,
      resolve: (skill) => skill.files ?? [],
    }),
    hasExecutable: t.boolean({
      nullable: false,
      resolve: (skill) => Boolean(skill.executable),
    }),
  }),
})

export const SkillExecutionResultType = builder.simpleObject(
  'SkillExecutionResult',
  {
    fields: (t) => ({
      stdout: t.string({ nullable: false }),
      stderr: t.string({ nullable: false }),
      exitCode: t.int({ nullable: false }),
      durationMs: t.int({ nullable: false }),
    }),
  },
)
