import {
  SortOrder,
  useTimersQuery,
  useUpdateTimerMutation,
} from 'src/gql/generated'
import { TimerIndicator } from '../../TimerIndicator'
import React, { useCallback } from 'react'
import { useAppContext } from 'src/components/AppContext'

export const HeaderTimer: React.FC = () => {
  const { user: currentUser } = useAppContext()

  const response = useTimersQuery({
    variables: {
      where: {
        stoppedAt: null,
      },
      orderBy: {
        createdAt: SortOrder.DESC,
      },
      take: 1,
    },
    pollInterval: 5000,
    ssr: false,
  })

  const timer = response.data?.timers?.at(0)

  const canEdit = timer && timer.createdById === currentUser?.id

  const [updateMutation, { client }] = useUpdateTimerMutation()

  const onClickStop = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      const value = event.currentTarget.value

      if (value) {
        updateMutation({
          variables: {
            data: {
              stoppedAt: new Date(),
            },
            where: {
              id: value,
            },
          },
        }).then((r) => {
          if (r.data?.response) {
            client.resetStore().catch(console.error)
          }
        })
      }
    },
    [updateMutation, client],
  )

  return (
    <noindex>
      <TimerIndicator
        active={timer}
        taskTitle={timer?.Task?.title}
        // elapsedLabel={active ? formatElapsed(elapsedMs) : undefined}
        // TODO Fix
        elapsedLabel={undefined}
        href={timer?.Task ? `/tasks/${timer?.Task.id}` : '/timers'}
        // onOpen={(href) => navigate({ to: href })}
        // onStop={active ? stop : undefined}
        onClickStop={canEdit ? onClickStop : undefined}
      />
    </noindex>
  )
}
