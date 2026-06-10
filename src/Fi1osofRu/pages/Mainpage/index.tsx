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

const title =
  'Николай Ланец · Fi1osof. Инженер-исследователь · публичный журнал'
const description = 'Официальный сайт программиста Николая Ланца.'

export const Fi1osofRuMainPage: Page = ({ origin }) => {
  const response = useMainPageDataQuery()

  const { projects, tasks, workLogs } = useMemo(() => {
    const projects: Project[] = [
      {
        id: 'fi1osof.ru',
        title: 'fi1osof.ru',
        description: '',
        intro: 'Мой личный проект. Сейчас активно работаю над его обновлением',
        slug: '/',
        startedAt: '11.06.2026',
        status: 'active',
      },
      {
        id: 'happybaby2000.ru',
        title: 'happybaby2000.ru',
        description:
          'Интернет-магазин детских комплексов и комплектующих к ним',
        intro:
          'Коммерческий проект. Сайту более 17 лет. Изначально был разработан на MODX Revolution, на нем и продолжает работать на сервер. Но фронт теперь полностью переделан с нуля на моем собственном движке',
        slug: 'https://happybaby2000.ru',
        startedAt: '08.06.2026',
        status: 'active',
      },
      {
        id: 'analyra.ru',
        title: 'analyra.ru',
        description: '',
        intro:
          'Мой личный проект. Цель - полностью автоматизировать проверку сайта не только на SEO и технические ошибки, но и ручное тестирование силами ИИ-агента, то есть агент будет заходить на сайт, пытаться понять зачем он, пройти пользовательские сценарии и дать всему этому свою оценку. Пока что ИИ-часть еще не доделана, но поверхностный анализ сайта можете выполнить - просто укажите там УРЛ своего сайта. Пока что доступно бесплатно.',
        slug: 'https://analyra.ru',
        startedAt: '22.05.2026',
        status: 'active',
      },
      {
        id: 'ne-chatgpt.ru',
        title: 'ne-chatgpt.ru',
        description: '',
        intro: `Это не ЧатГПТ, это ДРУГОЕ :-) <br />
Мой личный проект. Оформление пока не сделал, но если у вас нет под ругой другого ИИ-чата, вполне можете пообщаться там. При чем это не просто чат, а ИИ-агент со своей памятью. Функции новые полезные я ему скоро добавлю.
        `,
        slug: 'https://ne-chatgpt.ru',
        startedAt: '22.05.2026',
        status: 'active',
      },
    ]

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
      <SeoHeaders title={title} description={description} />
      {origin && (
        <JsonLd
          data={createWebSite({
            name: title,
            url: origin,
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
