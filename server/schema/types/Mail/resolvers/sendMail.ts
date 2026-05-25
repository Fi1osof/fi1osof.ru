import { builder } from 'server/schema/builder'
import { sendMail } from '../helpers/sendMail'

const SendMailDataInput = builder.inputType('SendMailDataInput', {
  fields: (t) => ({
    to: t.string({ required: true }),
    subject: t.string({ required: true }),
    text: t.string(),
    html: t.string(),
  }),
})

builder.mutationField('sendMail', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      data: t.arg({
        type: SendMailDataInput,
        required: true,
      }),
    },
    async resolve(_root, { data }) {
      return sendMail({
        to: data.to,
        subject: data.subject,
        text: data.text || undefined,
        html: data.html || undefined,
      })
    },
  }),
)
