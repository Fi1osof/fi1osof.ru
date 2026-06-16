import type React from 'react'
import {
  HeroStyled,
  HeroImageStyled,
  TitleStyled,
  DescStyled,
  // MetaRowStyled,
  ContentWrapStyled,
  MetaRowStyled,
  // GithubBlockStyled,
  // GithubCellStyled,
  // GithubNumStyled,
  // RelatedRowStyled,
} from './styles'
import {
  // Post,
  ProjectFragment,
  TaskFragment,
  // TaskFragment,
  // TaskStatusEnum,
} from 'src/gql/generated'
import { Container } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Container'
import { Breadcrumbs } from 'src/Fi1osofRu/lovable/src/ui-kit/Navigation/Breadcrumbs'
import { getResizedImagePath } from 'src/helpers/getResizedImagePath'
import { Section } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Section'
import { Markdown } from 'src/components/Markdown'
import { useAppContext } from 'src/components/AppContext'
import { useBoolean } from 'src/hooks/useBoolean'
import { Button } from 'src/ui-kit/Button'
import { ProjectEditForm } from './Form'
import { ActivityIndicator } from 'src/Fi1osofRu/lovable/src/ui-kit/Status/ActivityIndicator'
import { formatDateIntl } from 'src/ui-kit/format/FormattedDate'
import Link from 'next/link'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { TaskList } from 'src/Fi1osofRu/lovable/src/ui-kit/Lists/TaskList'
import { useMemo } from 'react'
import { TaskListItem } from 'src/Fi1osofRu/lovable/src/ui-kit/Lists/TaskList/types'
import { ActivityKindMap } from 'src/Fi1osofRu/lovable/src/mocks/tasks'

interface ProjectPageViewProps {
  project: ProjectFragment
  tasks: TaskFragment[]
  // topics: Topic[]
  // allProjects: Project[]
  // hrefForProject: (slug: string) => string
  // hrefForTask: (slug: string) => string
  // hrefForTopic: (slug: string) => string
  // hrefForProjectsList: () => string
  // onOpen: (href: string) => void;
}

export const ProjectPageView: React.FC<ProjectPageViewProps> = ({
  project,
  tasks,
  // topics,
  // allProjects,
  // hrefForProject,
  // hrefForTask,
  // hrefForTopic,
  // hrefForProjectsList,
  // onOpen,
}) => {
  const { name: title, intro, image, content, createdAt } = project

  const { user: currentUser } = useAppContext()

  const [inEditMode, inEditModeOn, inEditModeOff] = useBoolean()

  const canEdit = currentUser?.sudo || currentUser?.id === project.createdById

  const { activeTasks } = useMemo(() => {
    const activeTasks: TaskListItem[] = tasks.map<TaskListItem>((n) => {
      return {
        id: n.id,
        href: `/tasks/${n.id}`,
        problem: null,
        status: ActivityKindMap[n.status],
        title: n.title,
      }
    })

    return { activeTasks }
  }, [tasks])

  // const tasks: TaskFragment[] = []

  // const active = tasks.filter((t) => t.status !== TaskStatusEnum.DONE)
  // const finished = tasks.filter((t) => t.status === TaskStatusEnum.DONE)

  // const related: ProjectFragment[] = []

  // const related = allProjects.filter((p) =>
  //   relatedProjects?.includes(p.id),
  // )

  // const latestTopics = [...topics]
  //   .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  //   .slice(0, 3)

  // const latestTopics: Post[] = []

  let pageContent: React.ReactNode

  if (inEditMode) {
    pageContent = (
      <>
        <ProjectEditForm project={project} cancelHandler={inEditModeOff} />
      </>
    )
  } else {
    pageContent = (
      <>
        <HeroStyled>
          <Breadcrumbs
            items={[
              { id: 'home', label: 'Fi1osof', href: '/' },
              { id: 'projects', label: 'Проекты', href: '/projects' },
              { id: 'this', label: title },
            ]}
            // onNavigate={(item) => item.href && onOpen(item.href)}
          />
          <TitleStyled>
            <span>{title}</span>

            {canEdit && (
              <>
                <Link
                  href={`/tasks/create?projectId=${project.id}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button variant={ComponentVariant.DEFAULT}>
                    Создать задачу
                  </Button>
                </Link>

                <Button onClick={inEditModeOn}>Редактировать</Button>
              </>
            )}
          </TitleStyled>
          <DescStyled>
            <Markdown>{intro}</Markdown>
          </DescStyled>

          <MetaRowStyled>
            <ActivityIndicator kind={'active'} />
            <span>
              с{' '}
              {formatDateIntl({
                value: createdAt,
                format: 'dateShort',
              })}
            </span>
            {/* {focus?.map((f) => (
              <Tag key={f}>{f}</Tag>
            ))} */}
          </MetaRowStyled>

          {image && (
            <HeroImageStyled>
              <img
                src={getResizedImagePath({
                  path: image,
                  size: 'big',
                })}
                alt={title}
              />
            </HeroImageStyled>
          )}
        </HeroStyled>

        {content && (
          <Section eyebrow="о проекте" title="Описание">
            <ContentWrapStyled>
              <Markdown>{content}</Markdown>
            </ContentWrapStyled>
          </Section>
        )}

        {/* {history && history.length > 0 && (
        <Section eyebrow="история" title="Хронология проекта">
          <Timeline
            items={history.map((h) => ({
              id: h.id,
              eventAt: h.eventAt,
              publishedAt: h.publishedAt,
              label: h.label,
              content: <span>{h.text}</span>,
            }))}
          />
        </Section>
      )} */}

        {/* {related.length > 0 && (
        <Section eyebrow="граф" title="Связанные проекты">
          <RelatedRowStyled>
            {related.map((p) => (
              <EntityLink
                key={p.id}
                href={hrefForProject(p.slug)}
                kind="project"
                // onOpen={onOpen}
              >
                {p.title}
              </EntityLink>
            ))}
          </RelatedRowStyled>
        </Section>
      )} */}

        <Section
          eyebrow="работа"
          title={`Активные задачи · ${activeTasks.length}`}
        >
          {activeTasks.length > 0 ? (
            <TaskList
              // items={activeTasks.map((t) => ({
              //   id: t.id,
              //   title: t.title,
              //   problem: t.problem,
              //   status: t.status,
              //   worklogCount: t.worklogs?.length ?? 0,
              //   href: `/tasks/${t.id}`,
              // }))}
              items={activeTasks}
              // onOpen={onOpen}
            />
          ) : (
            <DescStyled>Нет активных задач.</DescStyled>
          )}
        </Section>

        {/* {finished.length > 0 && (
        <Section
          eyebrow="архив"
          title={`Завершённые задачи · ${finished.length}`}
        >
          <TaskList
            items={finished.map((t) => ({
              id: t.id,
              title: t.title,
              problem: t.problem,
              status: t.status,
              worklogCount: t.worklogs?.length ?? 0,
              href: hrefForTask(t.slug),
            }))}
            // onOpen={onOpen}
          />
        </Section>
      )} */}

        {/* {latestTopics.length > 0 && (
        <Section eyebrow="заметки" title="3 последние публикации по проекту">
          {latestTopics.map((t) => (
            <TopicCard
              key={t.id}
              title={t.title}
              excerpt={t.excerpt}
              eventAt={t.eventAt}
              publishedAt={t.publishedAt}
              href={hrefForTopic(t.slug)}
              // onOpen={onOpen}
            />
          ))}
        </Section>
      )} */}

        {/* {github && (
        <Section eyebrow="github" title="Активность в репозиториях">
          <GithubBlockStyled>
            <GithubCellStyled>
              <GithubNumStyled>{github.commits}</GithubNumStyled>
              коммитов
            </GithubCellStyled>
            <GithubCellStyled>
              <GithubNumStyled>{github.prs}</GithubNumStyled>
              pull requests
            </GithubCellStyled>
            <GithubCellStyled>
              <GithubNumStyled>{github.repos.length}</GithubNumStyled>
              {github.repos.join(', ')}
            </GithubCellStyled>
          </GithubBlockStyled>
        </Section>
      )} */}
      </>
    )
  }

  return <Container size="wide">{pageContent}</Container>
}
