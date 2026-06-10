import type React from 'react'
import { Container } from '../../ui-kit/Layout/Container'
import { Section } from '../../ui-kit/Layout/Section'
import { Tag } from '../../ui-kit/Meta/Tag'
import { AvailabilityIndicator } from '../../ui-kit/Status/AvailabilityIndicator'
import { ProjectList } from '../../ui-kit/Lists/ProjectList'
import { TaskList } from '../../ui-kit/Lists/TaskList'
import { WorklogList } from '../../ui-kit/Lists/WorklogList'
// import { TopicCard } from '../../ui-kit/Cards/TopicCard'
import {
  HeroStyled,
  HeroEyebrowStyled,
  HeroNameStyled,
  HeroDescStyled,
  FocusRowStyled,
  ActivityGridStyled,
  StatCardStyled,
  StatNumberStyled,
  StatLabelStyled,
  AvailabilityWrapStyled,
  CommitTimelineStyled,
  CommitItemStyled,
  CommitTitleStyled,
  CommitMetaStyled,
  CommitBarStyled,
} from './styles'
import type { HomePageProps } from './types'

const focusAreas = [
  'Agent Systems',
  'Memory Architectures',
  'AI Research',
  'Knowledge Graphs',
]

export const LovableHomePage: React.FC<HomePageProps> = ({
  projects,
  tasks,
  worklogs,
  topics: _topics,
  availability,
  // hrefForProject,
  // hrefForTask,
  // hrefForTopic,
  // onOpen,
}) => {
  // const { active, activeTasks } = useMemo(() => {
  //   const active = projects.filter((p) => p.status === 'active')
  //   const activeTasks = tasks.filter(
  //     (t) => t.status === 'active' || t.status === 'research',
  //   )

  //   return {
  //     active,
  //     activeTasks,
  //   }
  // }, [projects, tasks])

  const blocks: {
    key: string
    title: string
    content: React.ReactNode
    aside?: React.ReactNode
  }[] = [
    // TODO Maybe restore?
    // {
    //   key: 'activity',
    //   title: 'Активность',
    //   content: (
    //     <ActivityGridStyled>
    //       <StatCardStyled>
    //         <StatNumberStyled>{active.length}</StatNumberStyled>
    //         <StatLabelStyled>активных проектов</StatLabelStyled>
    //       </StatCardStyled>
    //       <StatCardStyled>
    //         <StatNumberStyled>{activeTasks.length}</StatNumberStyled>
    //         <StatLabelStyled>активных задач</StatLabelStyled>
    //       </StatCardStyled>
    //       <StatCardStyled>
    //         <StatNumberStyled>{worklogs.length}</StatNumberStyled>
    //         <StatLabelStyled>последних ворклогов</StatLabelStyled>
    //       </StatCardStyled>
    //       <StatCardStyled>
    //         <StatNumberStyled>{topics.length}</StatNumberStyled>
    //         <StatLabelStyled>новых заметок</StatLabelStyled>
    //       </StatCardStyled>
    //     </ActivityGridStyled>
    //   ),
    // },

    {
      key: 'availabily',
      title: 'Карта доступности',
      aside: <AvailabilityIndicator status={availability.status} />,
      content: (
        <AvailabilityWrapStyled>
          <div>
            <StatLabelStyled style={{ marginBottom: 12 }}>
              фиксированные обязательства
            </StatLabelStyled>
            <CommitTimelineStyled>
              {availability.fixed.map((c) => (
                <CommitItemStyled key={c.id}>
                  <div>
                    <CommitTitleStyled>{c.title}</CommitTitleStyled>
                    <CommitMetaStyled>
                      {c.from} → {c.to} · {c.load}
                    </CommitMetaStyled>
                    <CommitBarStyled />
                  </div>
                  <Tag tone="warm">обязательство</Tag>
                </CommitItemStyled>
              ))}
            </CommitTimelineStyled>
          </div>
          <div>
            <StatLabelStyled style={{ marginBottom: 12 }}>
              текущая нагрузка
            </StatLabelStyled>
            <ActivityGridStyled style={{ gridTemplateColumns: '1fr 1fr' }}>
              <StatCardStyled>
                <StatNumberStyled>{availability.commercial}</StatNumberStyled>
                <StatLabelStyled>коммерческих задач</StatLabelStyled>
              </StatCardStyled>
              <StatCardStyled>
                <StatNumberStyled>{availability.personal}</StatNumberStyled>
                <StatLabelStyled>личных исследований</StatLabelStyled>
              </StatCardStyled>
            </ActivityGridStyled>
          </div>
        </AvailabilityWrapStyled>
      ),
    },

    {
      key: 'projects',
      title: 'Активные проекты',
      content: (
        <ProjectList
          items={projects.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.intro,
            status: p.status,
            startedAt: p.startedAt,
            focus: p.focus,
            image: p.image,
            href: p.slug,
          }))}
          // onOpen={onOpen}
        />
      ),
    },

    {
      key: 'tasks',
      title: 'Активные задачи',
      content: (
        <TaskList
          items={tasks.map((t) => ({
            id: t.id,
            title: t.title,
            problem: t.problem,
            status: t.status,
            projectName: projects.find((p) => p.id === t.projectId)?.title,
            worklogCount: t.worklogs?.length ?? 0,
            href: t.slug,
          }))}
          // onOpen={onOpen}
        />
      ),
    },
    {
      key: '',
      title: 'Последние ворклоги',
      content: (
        <WorklogList
          items={worklogs.map((w) => ({
            id: w.id,
            taskTitle: w.taskTitle,
            body: w.body,
            eventAt: w.eventAt,
            publishedAt: w.publishedAt,
            href: w.taskHref,
          }))}
          // onOpen={onOpen}
        />
      ),
    },
    // {
    //   key: '',
    //   title: 'Новые заметки',
    //   content: (
    //     <>
    //       {topics.slice(0, 5).map((t) => (
    //         <TopicCard
    //           key={t.id}
    //           title={t.title}
    //           excerpt={t.excerpt}
    //           eventAt={t.eventAt}
    //           publishedAt={t.publishedAt}
    //           href={t.slug}
    //           // onOpen={onOpen}
    //         />
    //       ))}
    //     </>
    //   ),
    // },
  ]

  return (
    <Container size="wide">
      <HeroStyled>
        <HeroEyebrowStyled>
          журнал инженерной деятельности · fi1osof.ru
        </HeroEyebrowStyled>
        <HeroNameStyled>Николай Ланец</HeroNameStyled>
        <HeroDescStyled>
          Я веду публичный рабочий журнал: проекты, задачи, ворклоги и заметки.
          Здесь видно, чем я занят сейчас, как развиваются идеи и какие решения
          принимаю в процессе.
        </HeroDescStyled>
        <FocusRowStyled>
          {focusAreas.map((f) => (
            <Tag key={f} tone="accent">
              {f}
            </Tag>
          ))}
        </FocusRowStyled>
      </HeroStyled>

      {/* <Section eyebrow="01" title="Activity Overview"></Section> */}

      {blocks.map((n, index) => {
        return (
          <Section
            eyebrow={(index + 1).toString().padStart(2, '0')}
            title={n.title}
            aside={n.aside}
          >
            {n.content}
          </Section>
        )
      })}

      {/* <Section eyebrow="03" title=""></Section>

      <Section eyebrow="04" title=""></Section>

      <Section eyebrow="05" title=""></Section>

      <Section eyebrow="06" title=""></Section> */}
    </Container>
  )
}
