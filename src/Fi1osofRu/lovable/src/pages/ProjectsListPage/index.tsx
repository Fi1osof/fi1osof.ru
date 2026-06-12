import type React from 'react'
import { Container } from '../../ui-kit/Layout/Container'
import { Section } from '../../ui-kit/Layout/Section'
import { Breadcrumbs } from '../../ui-kit/Navigation/Breadcrumbs'
import { ProjectList } from '../../ui-kit/Lists/ProjectList'
import { HeroStyled, TitleStyled, DescStyled } from './styles'
import type { ProjectsListPageProps } from './types'

export const ProjectsListPage: React.FC<ProjectsListPageProps> = ({
  projects,
  // hrefForProject,
  // onOpen,
}) => {
  const active = projects.filter((p) => p.status !== 'paused')
  const archive = projects.filter((p) => p.status === 'paused')

  return (
    <Container size="wide">
      <HeroStyled>
        <Breadcrumbs
          items={[
            { id: 'home', label: 'fi1osof', href: '/' },
            { id: 'this', label: 'Проекты' },
          ]}
          // onNavigate={(item) => item.href && onOpen(item.href)}
        />
        <TitleStyled>Проекты</TitleStyled>
        <DescStyled>
          Всё, над чем я работаю или работал: исследовательские, инженерные,
          коммерческие. Каждый проект — это история со своей эволюцией задач,
          заметок и решений.
        </DescStyled>
      </HeroStyled>

      <Section eyebrow="actual" title={`Активные · ${active.length}`}>
        <ProjectList
          items={active.map((p) => ({
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
      </Section>

      {archive.length > 0 && (
        <Section eyebrow="paused" title={`На паузе · ${archive.length}`}>
          <ProjectList
            items={archive.map((p) => ({
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
        </Section>
      )}
    </Container>
  )
}
