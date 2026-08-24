import { ProjectStatus } from '@prisma/client'
import { builder } from '../../../builder'
import { User } from '../../User'
import { ProjectStatusEnum } from './enums'
import { getFieldValueByLang } from '../../KBConcept/helpers/getFieldValueByLang'
import { JsonValue } from '@prisma/client/runtime/library'

export type ProjectDbModel = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null
  intro: string | null
  content: string | null
  image: string | null
  commercial: boolean
  status: ProjectStatus | null
  createdById: string

  CreatedBy?: typeof User.$inferType

  en?: JsonValue
  vi?: JsonValue
}

export const Project = builder.objectType(
  builder.objectRef<ProjectDbModel>('Project'),
  {
    fields(t) {
      return {
        id: t.exposeString('id', {
          nullable: false,
        }),
        createdAt: t.expose('createdAt', { type: 'DateTime', nullable: false }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime', nullable: false }),
        name: t.string({
          nullable: false,
          resolve(source, _, ctx) {
            return getFieldValueByLang(source, 'name', ctx)
          },
        }),
        description: t.string({
          resolve(source, _, ctx) {
            return getFieldValueByLang(source, 'description', ctx)
          },
        }),
        intro: t.string({
          resolve(source, _, ctx) {
            return getFieldValueByLang(source, 'intro', ctx)
          },
        }),
        content: t.string({
          resolve(source, _, ctx) {
            return getFieldValueByLang(source, 'content', ctx)
          },
        }),
        image: t.exposeString('image', {
          nullable: true,
        }),
        commercial: t.exposeBoolean('commercial', {
          nullable: false,
        }),
        status: t.expose('status', {
          type: ProjectStatusEnum,
          nullable: true,
        }),
        createdById: t.exposeString('createdById', {
          nullable: false,
        }),
        CreatedBy: t.field({
          type: User,
          nullable: true,
          resolve: (parent) => parent.CreatedBy,
        }),
      }
    },
  },
)
