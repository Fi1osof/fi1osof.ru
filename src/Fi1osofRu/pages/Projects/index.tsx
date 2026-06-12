import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { ProjectsPageView } from './View'
import { ProjectsDocument, useProjectsQuery } from 'src/gql/generated'

export const ProjectsPage: Page = () => {
  const response = useProjectsQuery()

  const projects = response.data?.projects ?? []

  return (
    <>
      <SeoHeaders title="Проекты" />

      <ProjectsPageView projects={projects} />
    </>
  )
}

ProjectsPage.getInitialProps = async ({ apolloClient }) => {
  apolloClient.query({
    query: ProjectsDocument,
  })

  return {}
}
