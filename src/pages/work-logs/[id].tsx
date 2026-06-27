import { Page } from 'src/components/pages/_App/interfaces'

const RedirectPage: Page = () => {
  return null
}

RedirectPage.getInitialProps = async ({ res, query }) => {
  const id = typeof query.id === 'string' && query.id

  if (id && res) {
    res.writeHead(301, {
      Location: `/worklogs/${id}`,
    })
    res.end()
  }
  return {}
}

export default RedirectPage
