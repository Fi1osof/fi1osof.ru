import { Page } from 'src/components/pages/_App/interfaces'

const RedirectPage: Page = () => {
  return null
}

RedirectPage.getInitialProps = async ({ res }) => {
  if (res) {
    res.writeHead(301, {
      Location: '/worklogs',
    })
    res.end()
  }
  return {}
}

export default RedirectPage
