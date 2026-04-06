import { UserFragment } from 'src/gql/generated'
import {
  UserPageViewStyled,
  UserPageActionsStyled,
  UserPageViewToolbarStyled,
  UserPageViewAvatarStyled,
  UserPageViewInfoStyled,
} from './styles'
import { UserEditForm } from './Form'
import { useCallback, useState } from 'react'
import { Button } from 'src/ui-kit/Button'
import { SignOutButton } from 'src/components/Auth/SignOutButton'
import { useAppContext } from 'src/components/AppContext'
import { Markdown } from 'src/components/Markdown'
import { CurrentUserData } from './CurrentUserData'
import { SendTransfer } from './SendTransfer'
import { StatusToggler } from './StatusToggler'
import { SeparatorStyled } from 'src/components/Separator/styles'
import { GetReferrerToken } from './GetReferrerToken'
import { getResizedImagePath } from 'src/helpers/getResizedImagePath'

type UserPageViewProps = {
  user: UserFragment
}

export const UserPageView: React.FC<UserPageViewProps> = ({
  user,
  ...other
}) => {
  const { user: currentUser } = useAppContext()
  const [isEditing, setIsEditing] = useState(false)

  const isCurrentUser = currentUser?.id === user.id

  const handleEditClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsEditing(false)
  }, [])

  return (
    <UserPageViewStyled {...other}>
      <UserPageViewToolbarStyled>
        <h1>{user.fullname || user.username || user.id}</h1>

        <>
          <SeparatorStyled />
          <StatusToggler user={user} />
        </>
      </UserPageViewToolbarStyled>

      {isEditing ? (
        <UserEditForm user={user} closeForm={handleCloseForm} />
      ) : (
        <UserPageViewInfoStyled>
          {user.image && (
            <UserPageViewAvatarStyled
              src={getResizedImagePath({
                path: user.image,
                size: 'avatar',
              })}
            />
          )}

          <Markdown>{user.content}</Markdown>
        </UserPageViewInfoStyled>
      )}

      {isCurrentUser && currentUser && (
        <>
          <CurrentUserData currentUser={currentUser} />

          <GetReferrerToken />

          <UserPageActionsStyled>
            <Button onClick={handleEditClick}>Edit</Button>

            <SignOutButton />
          </UserPageActionsStyled>
        </>
      )}

      {!isCurrentUser && currentUser && (
        <SendTransfer currentUser={currentUser} recipient={user} />
      )}
    </UserPageViewStyled>
  )
}
