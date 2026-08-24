import type React from 'react'
import { HeroStyled, TitleStyled, DescStyled } from './styles'
import { ProjectFragment } from 'src/gql/generated'
import { Container } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Container'
import { Breadcrumbs } from 'src/Fi1osofRu/lovable/src/ui-kit/Navigation/Breadcrumbs'
import { Section } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Section'
import { ProjectList } from 'src/Fi1osofRu/lovable/src/ui-kit/Lists/ProjectList'
import { useMemo } from 'react'
import { ProjectListProps } from 'src/Fi1osofRu/lovable/src/ui-kit/Lists/ProjectList/types'
import { formatDateIntl } from 'src/ui-kit/format/FormattedDate'
import { getResizedImagePath } from 'src/helpers/getResizedImagePath'
import { useAppContext } from 'src/components/AppContext'
import { Button } from 'src/ui-kit/Button'
import Link from 'next/link'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { projectsViewLexicon } from './lexicon'

type ProjectCardItem = ProjectListProps['items'][number]

export interface ProjectsPageViewProps {
  projects: ProjectFragment[]
}

export const ProjectsPageView: React.FC<ProjectsPageViewProps> = ({
  projects,
}) => {
  const { user: currentUser } = useAppContext()
  const { t } = useLexicon(projectsViewLexicon)

  const canEdit = currentUser?.sudo === true

  const { ownProjects, commercialProjects } = useMemo(() => {
    const ownProjects: ProjectCardItem[] = []
    const commercialProjects: ProjectCardItem[] = []

    projects.forEach((n) => {
      const { commercial, image } = n

      const item: ProjectCardItem = {
        id: n.id,
        href: `/projects/${n.id}`,
        startedAt: formatDateIntl({
          value: n.createdAt,
          format: 'dateShort',
        }),
        title: n.name,
        status: 'active',
        image: image
          ? getResizedImagePath({
              path: image,
              size: 'middle',
            })
          : undefined,
      }

      if (commercial) {
        commercialProjects.push(item)
      } else {
        ownProjects.push(item)
      }

      return
    })

    return {
      ownProjects,
      commercialProjects,
    }
  }, [projects])

  return (
    <Container size="wide">
      <HeroStyled>
        <Breadcrumbs
          items={[
            { id: 'home', label: t('breadcrumbs.home'), href: '/' },
            { id: 'this', label: t('breadcrumbs.this') },
          ]}
        />
        <TitleStyled>
          <span>{t('hero.title')}</span>

          {canEdit && (
            <Link href={'/projects/create'}>
              <Button>{t('hero.create')}</Button>
            </Link>
          )}
        </TitleStyled>
        <DescStyled>{t('hero.description')}</DescStyled>
      </HeroStyled>

      <Section title={t('sections.commercial')}>
        <ProjectList items={commercialProjects} />
      </Section>

      <Section title={t('sections.personal')}>
        <ProjectList items={ownProjects} />
      </Section>
    </Container>
  )
}
