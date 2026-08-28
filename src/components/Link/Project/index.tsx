import Link from 'next/link'
import React from 'react'
import { ProjectNoNestingFragment } from 'src/gql/generated'

export function createProjectLink(
  object: Pick<ProjectNoNestingFragment, 'id'>,
): string {
  const { id } = object

  return `/projects/${id}`
}

type ProjectLinkProps = React.PropsWithChildren & {
  object: ProjectNoNestingFragment | null | undefined
  className?: string
}

export const ProjectLink: React.FC<ProjectLinkProps> = ({
  object,
  children,
  className,
}) => {
  if (!object) {
    return null
  }

  const href = createProjectLink(object)

  return (
    <Link href={href} className={className}>
      {children || object.id}
    </Link>
  )
}
