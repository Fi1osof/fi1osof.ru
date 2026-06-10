import type React from 'react'
import { Container } from '../../ui-kit/Layout/Container'
import { Section } from '../../ui-kit/Layout/Section'
import { Breadcrumbs } from '../../ui-kit/Navigation/Breadcrumbs'
import { Timeline } from '../../ui-kit/Layout/Timeline'
import { Tag } from '../../ui-kit/Meta/Tag'
import { EntityLink } from '../../ui-kit/Meta/EntityLink'
import { ActivityIndicator } from '../../ui-kit/Status/ActivityIndicator'
import { TaskList } from '../../ui-kit/Lists/TaskList'
import { TopicCard } from '../../ui-kit/Cards/TopicCard'
import { Markdown } from '../../ui-kit/Markdown'
import {
  HeroStyled,
  HeroImageStyled,
  TitleStyled,
  DescStyled,
  MetaRowStyled,
  ContentWrapStyled,
  GithubBlockStyled,
  GithubCellStyled,
  GithubNumStyled,
  RelatedRowStyled,
} from './styles'
import type { ProjectPageProps } from './types'

export const ProjectPage: React.FC<ProjectPageProps> = ({
  project,
  tasks,
  topics,
  allProjects,
  hrefForProject,
  hrefForTask,
  hrefForTopic,
  hrefForProjectsList,
  // onOpen,
}) => {
  const active = tasks.filter((t) => t.status !== 'done')
  const finished = tasks.filter((t) => t.status === 'done')
  const related = allProjects.filter((p) =>
    project.relatedProjects?.includes(p.id),
  )
  const latestTopics = [...topics]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 3)

  return (
    <Container size="wide">
      <HeroStyled>
        <Breadcrumbs
          items={[
            { id: 'home', label: 'fi1osof', href: '/' },
            { id: 'projects', label: 'Проекты', href: hrefForProjectsList() },
            { id: 'this', label: project.title },
          ]}
          // onNavigate={(item) => item.href && onOpen(item.href)}
        />
        <TitleStyled>{project.title}</TitleStyled>
        <DescStyled>{project.intro}</DescStyled>
        <MetaRowStyled>
          <ActivityIndicator kind={project.status} />
          <span>с {project.startedAt}</span>
          {project.focus?.map((f) => (
            <Tag key={f}>{f}</Tag>
          ))}
        </MetaRowStyled>
        {project.image && (
          <HeroImageStyled>
            <img src={project.image} alt={project.title} />
          </HeroImageStyled>
        )}
      </HeroStyled>

      {project.content && (
        <Section eyebrow="о проекте" title="Описание">
          <ContentWrapStyled>
            <Markdown source={project.content} />
          </ContentWrapStyled>
        </Section>
      )}

      {project.history && project.history.length > 0 && (
        <Section eyebrow="история" title="Хронология проекта">
          <Timeline
            items={project.history.map((h) => ({
              id: h.id,
              eventAt: h.eventAt,
              publishedAt: h.publishedAt,
              label: h.label,
              content: <span>{h.text}</span>,
            }))}
          />
        </Section>
      )}

      {related.length > 0 && (
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
      )}

      <Section eyebrow="работа" title={`Активные задачи · ${active.length}`}>
        {active.length > 0 ? (
          <TaskList
            items={active.map((t) => ({
              id: t.id,
              title: t.title,
              problem: t.problem,
              status: t.status,
              worklogCount: t.worklogs?.length ?? 0,
              href: hrefForTask(t.slug),
            }))}
            // onOpen={onOpen}
          />
        ) : (
          <DescStyled>Нет активных задач.</DescStyled>
        )}
      </Section>

      {finished.length > 0 && (
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
      )}

      {latestTopics.length > 0 && (
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
      )}

      {project.github && (
        <Section eyebrow="github" title="Активность в репозиториях">
          <GithubBlockStyled>
            <GithubCellStyled>
              <GithubNumStyled>{project.github.commits}</GithubNumStyled>
              коммитов
            </GithubCellStyled>
            <GithubCellStyled>
              <GithubNumStyled>{project.github.prs}</GithubNumStyled>
              pull requests
            </GithubCellStyled>
            <GithubCellStyled>
              <GithubNumStyled>{project.github.repos.length}</GithubNumStyled>
              {project.github.repos.join(', ')}
            </GithubCellStyled>
          </GithubBlockStyled>
        </Section>
      )}
    </Container>
  )
}
