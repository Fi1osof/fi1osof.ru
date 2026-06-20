import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from 'src/components/AppContext'
import { createUserLink } from 'src/components/Link/User'

export function useAuthedRedirect() {
  const router = useRouter()

  const { user } = useAppContext()

  useEffect(() => {
    if (user) {
      router.push(createUserLink(user))
    }
  }, [user, router])
}
