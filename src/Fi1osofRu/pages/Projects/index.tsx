import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { ProjectsPageView } from './View'
import { ProjectsDocument, useProjectsQuery } from 'src/gql/generated'

export const ProjectsPage: Page = ({ siteOrigin }) => {
  const response = useProjectsQuery()

  const projects = response.data?.projects ?? []

  return (
    <>
      <SeoHeaders
        title="Проекты"
        canonical={'/projects'}
        siteOrigin={siteOrigin}
      />

      <ProjectsPageView projects={projects} />
    </>
  )
}

ProjectsPage.getInitialProps = async ({ apolloClient }) => {
  await apolloClient.query({
    query: ProjectsDocument,
  })

  return {}
}
