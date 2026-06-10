import type React from 'react'
import { Container } from '../../ui-kit/Layout/Container'
import { Section } from '../../ui-kit/Layout/Section'
import { Breadcrumbs } from '../../ui-kit/Navigation/Breadcrumbs'
import { TopicCard } from '../../ui-kit/Cards/TopicCard'
import { Tag } from '../../ui-kit/Meta/Tag'
import { HeroStyled, TitleStyled, DescStyled, RelationStyled } from './styles'
import type { TopicsListPageProps } from './types'

export const TopicsListPage: React.FC<TopicsListPageProps> = ({
  topics,
  projects,
  tasks,
  hrefForTopic,
  hrefForProject,
  hrefForTask,
  // onOpen,
}) => {
  const sorted = [...topics].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  )

  return (
    <Container size="wide">
      <HeroStyled>
        <Breadcrumbs
          items={[
            { id: 'home', label: 'fi1osof', href: '/' },
            { id: 'this', label: 'Заметки' },
          ]}
          // onNavigate={(item) => item.href && onOpen(item.href)}
        />
        <TitleStyled>Заметки</TitleStyled>
        <DescStyled>
          Публикации, размышления, разборы. Часть связана с конкретными
          проектами или задачами, часть — самостоятельная.
        </DescStyled>
      </HeroStyled>

      <Section eyebrow="журнал" title={`Все публикации · ${sorted.length}`}>
        {sorted.map((t) => {
          const project = t.projectId
            ? projects.find((p) => p.id === t.projectId)
            : undefined
          const task = t.taskId
            ? tasks.find((x) => x.id === t.taskId)
            : undefined
          return (
            <div key={t.id}>
              <TopicCard
                title={t.title}
                excerpt={t.excerpt}
                eventAt={t.eventAt}
                publishedAt={t.publishedAt}
                href={hrefForTopic(t.slug)}
                // onOpen={onOpen}
              />
              {(project || task) && (
                <RelationStyled>
                  <span>связано:</span>
                  {project && (
                    <a
                      href={hrefForProject(project.slug)}
                      // onClick={(e) => { e.preventDefault(); onOpen(hrefForProject(project.slug)); }}
                      style={{ textDecoration: 'none' }}
                    >
                      <Tag tone="accent">проект · {project.title}</Tag>
                    </a>
                  )}
                  {task && (
                    <a
                      href={hrefForTask(task.slug)}
                      // onClick={(e) => { e.preventDefault(); onOpen(hrefForTask(task.slug)); }}
                      style={{ textDecoration: 'none' }}
                    >
                      <Tag tone="warm">задача · {task.title}</Tag>
                    </a>
                  )}
                </RelationStyled>
              )}
            </div>
          )
        })}
      </Section>
    </Container>
  )
}
