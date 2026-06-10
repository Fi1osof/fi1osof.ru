import type React from 'react'
import { Container } from '../../ui-kit/Layout/Container'
import { Section } from '../../ui-kit/Layout/Section'
import { Breadcrumbs } from '../../ui-kit/Navigation/Breadcrumbs'
import { Timeline } from '../../ui-kit/Layout/Timeline'
import { ActivityIndicator } from '../../ui-kit/Status/ActivityIndicator'
import { EntityLink } from '../../ui-kit/Meta/EntityLink'
import { WorklogCard } from '../../ui-kit/Cards/WorklogCard'
import {
  HeroStyled,
  TitleStyled,
  BlockStyled,
  ResultBlockStyled,
  LabelStyled,
  ParaStyled,
  MetaRowStyled,
  RelatedRowStyled,
  GithubBlockStyled,
  GithubCellStyled,
  GithubNumStyled,
} from './styles'
import type { TaskPageProps } from './types'

export const TaskPage: React.FC<TaskPageProps> = ({
  task,
  project,
  relatedTasks,
  hrefForTask,
  hrefForProject,
  hrefForProjectsList,
  // onOpen,
}) => (
  <Container size="wide">
    <HeroStyled>
      <Breadcrumbs
        items={[
          { id: 'home', label: 'fi1osof', href: '/' },
          { id: 'projects', label: 'Проекты', href: hrefForProjectsList() },
          ...(project
            ? [
                {
                  id: 'project',
                  label: project.title,
                  href: hrefForProject(project.slug),
                },
              ]
            : []),
          { id: 'this', label: task.title },
        ]}
        // onNavigate={(item) => item.href && onOpen(item.href)}
      />
      <TitleStyled>{task.title}</TitleStyled>
      <MetaRowStyled>
        <ActivityIndicator kind={task.status} />
        {project && (
          <EntityLink
            href={hrefForProject(project.slug)}
            kind="project"
            // onOpen={onOpen}
          >
            {project.title}
          </EntityLink>
        )}
        {task.worklogs && <span>ворклогов · {task.worklogs.length}</span>}
      </MetaRowStyled>
    </HeroStyled>

    <Section eyebrow="постановка" title="Проблема">
      <BlockStyled>
        <ParaStyled>{task.problem}</ParaStyled>
      </BlockStyled>
    </Section>

    <Section eyebrow="контекст" title="Почему задача возникла">
      <BlockStyled>
        <ParaStyled>{task.context}</ParaStyled>
      </BlockStyled>
    </Section>

    {task.worklogs && task.worklogs.length > 0 && (
      <Section eyebrow="хронология" title="Ворклоги">
        <Timeline
          items={task.worklogs.map((w) => ({
            id: w.id,
            eventAt: w.eventAt,
            publishedAt: w.publishedAt,
            content: (
              <WorklogCard
                body={w.body}
                eventAt={w.eventAt}
                publishedAt={w.publishedAt}
                href={`/worklogs/${w.id}`}
              />
            ),
          }))}
        />
      </Section>
    )}

    {task.result && (
      <Section eyebrow="итог" title="Решение и результат">
        <ResultBlockStyled>
          <LabelStyled>результат</LabelStyled>
          <ParaStyled>{task.result}</ParaStyled>
        </ResultBlockStyled>
      </Section>
    )}

    {relatedTasks.length > 0 && (
      <Section eyebrow="связи" title="Связанные задачи">
        <RelatedRowStyled>
          {relatedTasks.map((t) => (
            <EntityLink
              key={t.id}
              href={hrefForTask(t.slug)}
              kind="task"
              // onOpen={onOpen}
            >
              {t.title}
            </EntityLink>
          ))}
        </RelatedRowStyled>
      </Section>
    )}

    {task.github && (
      <Section eyebrow="github" title="Связанные коммиты и PR">
        <GithubBlockStyled>
          <GithubCellStyled>
            <GithubNumStyled>{task.github.commits}</GithubNumStyled>коммитов
          </GithubCellStyled>
          <GithubCellStyled>
            <GithubNumStyled>{task.github.prs}</GithubNumStyled>pull requests
          </GithubCellStyled>
          <GithubCellStyled>
            <GithubNumStyled>{task.github.repos.length}</GithubNumStyled>
            {task.github.repos.join(', ')}
          </GithubCellStyled>
        </GithubBlockStyled>
      </Section>
    )}
  </Container>
)
