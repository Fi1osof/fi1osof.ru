import { KbConceptFragment } from 'src/gql/generated'
import {
  ConceptItemStyled,
  ConceptItemMetaStyled,
  ConceptItemTitleStyled,
  ConceptItemDescriptionStyled,
} from './styles'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import { Markdown } from 'src/components/Markdown'
import { ConceptItemVariant } from './interfaces'
import { UserLink } from 'src/components/Link/User'
import { ConceptLink } from 'src/components/Link/Concept'

type ConceptItemProps = {
  concept: KbConceptFragment
  variant: ConceptItemVariant
}

export const ConceptItem: React.FC<ConceptItemProps> = ({
  concept,
  variant,
  ...other
}) => {
  const { id, name, description, intro, content, CreatedBy } = concept

  let contentBlock: React.ReactNode | null
  let title = <ConceptItemTitleStyled>{name || id}</ConceptItemTitleStyled>

  switch (variant) {
    case 'full':
      contentBlock = <>{content && <Markdown>{content}</Markdown>}</>
      break

    case 'list': {
      const text = intro || description
      contentBlock = text ? (
        <ConceptItemDescriptionStyled>
          <Markdown>{description}</Markdown>
        </ConceptItemDescriptionStyled>
      ) : null

      title = <ConceptLink object={concept}>{title}</ConceptLink>
    }
  }

  return (
    <ConceptItemStyled {...other} variant={variant}>
      {title}

      {contentBlock}

      <ConceptItemMetaStyled>
        <ConceptLink object={concept}>
          <FormattedDate value={concept.updatedAt} format="dateTimeShort" />
        </ConceptLink>
        {CreatedBy && <UserLink user={CreatedBy} />}
      </ConceptItemMetaStyled>
    </ConceptItemStyled>
  )
}
