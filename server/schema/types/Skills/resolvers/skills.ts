import { builder } from 'server/schema/builder'
import { Skill } from '../types'
import { listSkills } from '../registry'
import { RegisteredSkill } from '../interfaces'

builder.queryField('skills', (t) =>
  t.field({
    type: [Skill],
    nullable: false,
    resolve: (): RegisteredSkill[] => listSkills(),
  }),
)
