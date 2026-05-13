import { builder } from 'server/schema/builder'
import { Skill } from '../types'
import { getSkill } from '../registry'
import { RegisteredSkill } from '../interfaces'

builder.queryField('skill', (t) =>
  t.field({
    type: Skill,
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: (_root, args): RegisteredSkill | null => getSkill(args.id) ?? null,
  }),
)
