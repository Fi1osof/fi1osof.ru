import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { SignUpForm } from 'src/components/Auth/SignUpForm'
import { SignUpPageStyled } from './styles'
import { useAuthedRedirect } from 'src/components/Auth/hooks/useAuthedRedirect'

export const SignUpPage: React.FC = () => {
  useAuthedRedirect()

  const router = useRouter()

  const handleSuccess = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <SignUpPageStyled>
      <h1>Sign Up</h1>
      <SignUpForm onSuccessHandler={handleSuccess} />
    </SignUpPageStyled>
  )
}
