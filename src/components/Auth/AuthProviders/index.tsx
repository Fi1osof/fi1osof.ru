import { SigninMutation } from 'src/gql/generated'
import { AuthProvidersStyled } from './styles'
import { MetaMaskAuth } from '../MetaMaskAuth'
import { TelegramAuthForm } from 'src/components/TelegramAuthForm'

type AuthProvidersProps = {
  onSuccessHandler: ((data?: SigninMutation['response']) => void) | undefined
}

export const AuthProviders: React.FC<AuthProvidersProps> = ({
  onSuccessHandler,
}) => {
  return (
    <AuthProvidersStyled>
      <MetaMaskAuth onSuccess={onSuccessHandler} />

      <TelegramAuthForm onAuthSuccessHandler={onSuccessHandler} />
    </AuthProvidersStyled>
  )
}
