import { Page, PageProps } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import {
  ProjectDocument,
  ProjectQuery,
  ProjectQueryVariables,
  useProjectQuery,
} from 'src/gql/generated'
import { ProjectPageView } from './View'

type ProjectPage = PageProps & {
  id: string | undefined
}

export const ProjectPage: Page<ProjectPage> = ({ id }) => {
  const response = useProjectQuery({
    variables: {
      where: {
        id,
      },
    },
    skip: !id,
  })

  const project = response.data?.project

  if (!project) {
    return null
  }

  return (
    <>
      <SeoHeaders title={project.name} />

      <ProjectPageView project={project} />
    </>
  )
}

ProjectPage.getInitialProps = async ({ query, apolloClient }) => {
  const id: string | undefined =
    typeof query.id === 'string' && query.id ? query.id : undefined

  const response = id
    ? // eslint-disable-next-line @typescript-eslint/no-deprecated
      await apolloClient.query<ProjectQuery, ProjectQueryVariables>({
        query: ProjectDocument,
        variables: {
          where: {
            id: id,
          },
        },
      })
    : undefined

  return {
    id,
    statusCode: !response?.data ? 404 : undefined,
  }
}
