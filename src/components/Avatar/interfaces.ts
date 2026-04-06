import { UserNoNestingFragment } from 'src/gql/generated'

export interface UserAvatarProps {
  user: Partial<UserNoNestingFragment> & {
    __typename?: 'User'
  }
  className?: string
  size?: 'normal' | 'small' | 'big'
  editable?: boolean
}
