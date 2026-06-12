import { Page, PageProps } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import {
  ProjectPageDataDocument,
  ProjectPageDataQuery,
  ProjectPageDataQueryVariables,
  useProjectPageDataQuery,
} from 'src/gql/generated'
import { ProjectPageView } from './View'

type ProjectPage = PageProps & {
  id: string | undefined
}

export const ProjectPage: Page<ProjectPage> = ({ id }) => {
  const response = useProjectPageDataQuery({
    variables: {
      projectId: id || '',
    },
    skip: !id,
  })

  const { project, tasks } = response.data || {}

  if (!project) {
    return null
  }

  return (
    <>
      <SeoHeaders title={project.name} />

      <ProjectPageView project={project} tasks={tasks ?? []} />
    </>
  )
}

ProjectPage.getInitialProps = async ({ query, apolloClient }) => {
  const id: string | undefined =
    typeof query.id === 'string' && query.id ? query.id : undefined

  const response = id
    ? // eslint-disable-next-line @typescript-eslint/no-deprecated
      await apolloClient.query<
        ProjectPageDataQuery,
        ProjectPageDataQueryVariables
      >({
        query: ProjectPageDataDocument,
        variables: {
          projectId: id,
        },
      })
    : undefined

  return {
    id,
    statusCode: !response?.data ? 404 : undefined,
  }
}
