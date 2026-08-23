import React from 'react'
import { UserFragment } from 'src/gql/generated'
import {
  UsersViewStyled,
  UsersViewGridStyled,
  UsersViewCardStyled,
} from './styles'
import { SeparatorStyled } from 'src/components/Separator/styles'
import { StatusToggler } from '../User/View/StatusToggler'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import { Pagination } from 'src/components/Pagination'
import { UserLink } from 'src/components/Link/User'

type UsersViewProps = {
  users: UserFragment[]
  count: number
  page: number
  limit: number
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  count,
  limit,
  page,
}) => {
  const totalPages = count ? Math.floor(count / limit) : 0

  return (
    <UsersViewStyled>
      <h1>Users</h1>

      <UsersViewGridStyled>
        {users.map((user) => (
          <UsersViewCardStyled key={user.id}>
            <UserLink user={user} />

            <SeparatorStyled />

            <FormattedDate value={user.createdAt} />
            <StatusToggler user={user} />
          </UsersViewCardStyled>
        ))}
      </UsersViewGridStyled>

      <Pagination currentPage={page} totalPages={totalPages} />
    </UsersViewStyled>
  )
}
