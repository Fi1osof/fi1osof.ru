import Link from 'next/link'
import React from 'react'
import { TaskNoNestingFragment } from 'src/gql/generated'

export function createTaskLink(object: TaskNoNestingFragment): string {
  const { id } = object

  return `/tasks/${id}`
}

type TaskLinkProps = React.PropsWithChildren & {
  object: TaskNoNestingFragment | null | undefined
  className?: string
}

export const TaskLink: React.FC<TaskLinkProps> = ({
  object,
  children,
  className,
}) => {
  if (!object) {
    return null
  }

  const href = createTaskLink(object)

  return (
    <Link href={href} className={className}>
      {children || object.id}
    </Link>
  )
}
