import { SigninMutation } from 'src/gql/generated'
import { AuthProvidersStyled } from './styles'
import { MetaMaskAuth } from '../MetaMaskAuth'
import { TelegramAuthForm } from 'src/components/TelegramAuthForm'

type AuthProvidersProps = {
  onSuccessHandler: ((data?: SigninMutation['response']) => void) | undefined
  referrerToken: string | null
}

export const AuthProviders: React.FC<AuthProvidersProps> = ({
  onSuccessHandler,
  referrerToken,
}) => {
  return (
    <AuthProvidersStyled>
      <MetaMaskAuth
        onSuccess={onSuccessHandler}
        referrerToken={referrerToken}
      />

      <TelegramAuthForm
        onAuthSuccessHandler={onSuccessHandler}
        referrerToken={referrerToken}
      />
    </AuthProvidersStyled>
  )
}
