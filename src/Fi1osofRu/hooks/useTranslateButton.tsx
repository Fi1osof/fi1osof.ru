import React, { useCallback } from 'react'
import { useAppContext } from 'src/components/AppContext'
import {
  AdminBulkUpdateLangsMutationVariables,
  useAdminBulkUpdateLangsMutation,
} from 'src/gql/generated'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'

type useTranslateButtonProps = Pick<
  AdminBulkUpdateLangsMutationVariables,
  'entities'
> & {
  id: string
}

export function useTranslateButton({ entities, id }: useTranslateButtonProps) {
  const { user } = useAppContext()

  const [mutation, { loading, client }] = useAdminBulkUpdateLangsMutation()

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()

      mutation({
        variables: {
          force: true,
          entities,
          ids: [id],
          limit: 1,
        },
      }).then((r) => {
        if (r.data?.response) {
          client.resetStore().catch(console.error)
        }
      })
    },
    [entities, id, mutation, client],
  )

  const translateButton = (
    <Button
      disabled={loading}
      onClick={onClick}
      variant={ComponentVariant.DEFAULT}
    >
      Translate
    </Button>
  )

  return user?.sudo === true
    ? {
        translateButton,
      }
    : null
}
