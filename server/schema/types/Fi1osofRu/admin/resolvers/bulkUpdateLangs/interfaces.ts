import { LOCALES } from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'

export type LangFields = Record<string, string | undefined>

export type langKey = keyof Omit<typeof LOCALES, 'ru'>

export type FieldToTranslate = {
  field: string
  value: string
}

export type ProcessorResult = {
  total: number
  processed: number
  skipped: number
  success: number
  failed: Array<{
    entity: unknown
    error: unknown
  }>
}

export enum EntityType {
  Concept = 'Concept',
  Project = 'Project',
  Task = 'Task',
  TaskWorkLog = 'TaskWorkLog',
}
