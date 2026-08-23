import Link from 'next/link'
import React from 'react'
import { TaskWorkLogNoNestingFragment } from 'src/gql/generated'

export function createWorkLogLink(
  object: TaskWorkLogNoNestingFragment,
): string {
  const { id } = object

  return `/worklogs/${id}`
}

type WorkLogLinkProps = React.PropsWithChildren & {
  object: TaskWorkLogNoNestingFragment | null | undefined
}

export const WorkLogLink: React.FC<WorkLogLinkProps> = ({
  object,
  children,
}) => {
  if (!object) {
    return null
  }

  const href = createWorkLogLink(object)

  return <Link href={href}>{children || object.id}</Link>
}
