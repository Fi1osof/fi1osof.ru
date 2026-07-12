import React from 'react'
import { UserNoNestingFragment } from 'src/gql/generated'
import {
  UserLinkContainer,
  AvatarLink,
  UserAvatar,
  NameContainer,
  NameLink,
} from './styles'
import { Avatar } from 'src/components/Avatar'

const UserIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export function createUserLink(user: UserNoNestingFragment): string {
  const { id } = user

  return `/users/${id}`
}

type UserLinkProps = {
  user: UserNoNestingFragment
  withAvatar?: boolean
  showName?: boolean
  size?: 'small' | 'normal' | 'big'
  className?: string
}

export const UserLink: React.FC<UserLinkProps> = ({
  user,
  withAvatar = true,
  showName = true,
  size = 'normal',
  className,
}) => {
  if (!user) {
    return null
  }

  const { id, fullname, username } = user
  const displayName = fullname || username || id

  if (!id) {
    return null
  }

  const url = createUserLink(user)

  const avatarElement = withAvatar ? (
    <AvatarLink href={url} title={displayName}>
      {user.image ? (
        <Avatar user={user} size={size} />
      ) : (
        <UserAvatar $size={size}>
          <UserIcon />
        </UserAvatar>
      )}
    </AvatarLink>
  ) : null

  if (!showName && !withAvatar) {
    return null
  }

  return (
    <UserLinkContainer className={className}>
      {avatarElement}
      {showName && (
        <NameContainer>
          <NameLink href={url} $size={size}>
            {displayName}
          </NameLink>
        </NameContainer>
      )}
    </UserLinkContainer>
  )
}
