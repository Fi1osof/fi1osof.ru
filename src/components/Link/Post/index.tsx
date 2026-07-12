import Link from 'next/link'
import React from 'react'
import { PostNoNestingFragment } from 'src/gql/generated'

export function createPostLink(object: PostNoNestingFragment): string {
  const { id } = object

  return `/posts/${id}`
}

type PostLinkProps = React.PropsWithChildren & {
  object: PostNoNestingFragment | null | undefined
  className?: string
}

export const PostLink: React.FC<PostLinkProps> = ({
  object,
  children,
  className,
}) => {
  if (!object) {
    return null
  }

  const href = createPostLink(object)

  return (
    <Link href={href} className={className}>
      {children || object.id}
    </Link>
  )
}
