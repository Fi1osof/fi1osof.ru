import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Page } from 'src/components/pages/_App/interfaces'

export const Redirect410Page: Page = () => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div>
      <h1>Удалена навсегда</h1>
      <p>
        Страница была удалена.
        <br />
        Вы будете перенаправлены на главную страницу через 3 секунды...
      </p>
    </div>
  )
}

Redirect410Page.getInitialProps = async ({ res }) => {
  if (res) {
    res.statusCode = 410
  }

  return {}
}
