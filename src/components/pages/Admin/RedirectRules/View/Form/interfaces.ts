import { CreateRedirectRuleInput, RedirectPatternType } from 'src/gql/generated'
import * as yup from 'yup'

export type RedirectRuleFormData = CreateRedirectRuleInput

export const redirectRuleSchemaSchema: yup.ObjectSchema<RedirectRuleFormData> =
  yup.object().shape({
    comment: yup.string().nullable().optional(),
    enabled: yup.boolean().nullable().optional(),
    name: yup.string().required(),
    pattern: yup.string().required(),
    patternType: yup
      .mixed<RedirectPatternType>()
      .oneOf(Object.values(RedirectPatternType))
      .required(),
    priority: yup.number().integer().nullable().optional(),
    replacement: yup.string().required(),
    statusCode: yup.number().integer().nullable().optional(),
  })
