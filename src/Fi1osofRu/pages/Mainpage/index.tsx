import { useMemo } from 'react'
import { Page } from 'src/components/pages/_App/interfaces'
import { JsonLd } from 'src/components/seo/JsonLd'
import { createWebSite } from 'src/components/seo/JsonLd/helpers'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Project } from 'src/Fi1osofRu/lovable/src/mocks/projects'
import { Task } from 'src/Fi1osofRu/lovable/src/mocks/tasks'
import { LovableHomePage } from 'src/Fi1osofRu/lovable/src/pages/HomePage'
import { HomePageWorkLog } from 'src/Fi1osofRu/lovable/src/pages/HomePage/types'
import { ActivityKind } from 'src/Fi1osofRu/lovable/src/ui-kit/Status/ActivityIndicator/types'
import {
  MainPageDataDocument,
  TaskStatusEnum,
  useMainPageDataQuery,
} from 'src/gql/generated'
import { getResizedImagePath } from 'src/helpers/getResizedImagePath'
import { formatDateIntl } from 'src/ui-kit/format/FormattedDate'

const title =
  'Николай Ланец · Fi1osof. Инженер-исследователь · публичный журнал'
const description = 'Официальный сайт программиста Николая Ланца.'

export const Fi1osofRuMainPage: Page = ({ siteOrigin }) => {
  const response = useMainPageDataQuery()

  const { projects, tasks, workLogs } = useMemo(() => {
    const projects: Project[] =
      response.data?.projects?.map<Project>((n) => {
        const { id, image, name, createdAt } = n

        return {
          id,
          status: 'active',
          title: name,
          slug: `/projects/${id}`,
          startedAt: formatDateIntl({
            value: createdAt,
            format: 'dateShort',
          }),
          image: image
            ? getResizedImagePath({
                path: image,
                size: 'middle',
              })
            : undefined,
        }
      }) ?? []

    const tasks: Task[] =
      response.data?.tasks?.map<Task>((n) => {
        const { id, title, description: problem } = n

        // "active" | "research" | "paused" | "done"
        let status: ActivityKind

        switch (n.status) {
          case TaskStatusEnum.NEW:
            status = 'research'
            break
          case TaskStatusEnum.PROGRESS:
            status = 'active'
            break
          case TaskStatusEnum.DONE:
            status = 'done'
            break
          case TaskStatusEnum.REJECTED:
            status = 'paused'
            break
        }

        return {
          id,
          title,
          problem,
          slug: `/tasks/${n.id}`,
          status,
          worklogs: n.WorkLogs?.map<NonNullable<Task['worklogs']>[number]>(
            (nn) => {
              return {
                id: nn.id,
              }
            },
          ),
        }
      }) ?? []

    const workLogs: HomePageWorkLog[] =
      response.data?.taskWorkLogs
        ?.map<HomePageWorkLog | undefined>((n) => {
          const { Task } = n

          if (!Task) {
            return
          }

          return {
            id: n.id,
            taskId: Task.id,
            taskHref: `/worklogs/${n.id}`,
            taskTitle: Task.title,
            body: Task.description,
            publishedAt: n.createdAt?.toString(),
          }
        })
        .filter((n) => !!n) ?? []

    return {
      projects,
      tasks,
      workLogs,
    }
  }, [response.data])

  return (
    <>
      <SeoHeaders
        title={title}
        description={description}
        canonical={'/'}
        siteOrigin={siteOrigin}
      />
      {siteOrigin && (
        <JsonLd
          data={createWebSite({
            name: title,
            url: siteOrigin,
          })}
        />
      )}

      <LovableHomePage
        availability={{
          commercial: 5,
          fixed: [
            {
              id: 'c1',
              title: 'Веду курсы по ИИ',
              from: '15 июл 2026',
              to: '2 сен 2026',
              load: '2 ч / день',
            },
          ],
          personal: 12,
          status: 'available',
        }}
        projects={projects}
        tasks={tasks}
        topics={[]}
        worklogs={workLogs}
      />
    </>
  )
}

Fi1osofRuMainPage.getInitialProps = async ({ apolloClient }) => {
  await apolloClient.query({
    query: MainPageDataDocument,
  })

  return {}
}
