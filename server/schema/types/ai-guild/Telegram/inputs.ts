import { builder } from '../../../builder'

export const TelegramAuthDataInput = builder.inputType(
  'TelegramAuthDataInput',
  {
    fields: (t) => ({
      id: t.int({ required: true }),
      first_name: t.string(),
      last_name: t.string(),
      username: t.string(),
      photo_url: t.string(),
      auth_date: t.int(),
      hash: t.string(),
    }),
  },
)
