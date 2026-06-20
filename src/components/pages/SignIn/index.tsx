import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SignInForm } from 'src/components/Auth/SignInForm'
import { SignInPageStyled } from './styles'
import { useAuthedRedirect } from 'src/components/Auth/hooks/useAuthedRedirect'

export const SignInPage: React.FC = () => {
  useAuthedRedirect()

  const router = useRouter()

  const handleSuccess = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <SignInPageStyled>
      <h1>Sign In</h1>
      <SignInForm onSuccessHandler={handleSuccess} />
    </SignInPageStyled>
  )
}
