import { KbConceptFragment } from 'src/gql/generated'
import {
  ConceptItemStyled,
  ConceptItemMetaStyled,
  ConceptItemTitleStyled,
  ConceptItemDescriptionStyled,
  ConceptItemTypeStyled,
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
  const { id, name, description, type, content, CreatedBy } = concept

  let contentBlock: React.ReactNode | null

  switch (variant) {
    case 'full':
      contentBlock = <>{content && <Markdown>{content}</Markdown>}</>
      break

    default:
      contentBlock = null
  }

  return (
    <ConceptItemStyled {...other} $variant={variant}>
      <ConceptLink object={concept}>
        <ConceptItemTitleStyled>{name || id}</ConceptItemTitleStyled>
      </ConceptLink>

      {type && <ConceptItemTypeStyled>{type}</ConceptItemTypeStyled>}

      {description && (
        <ConceptItemDescriptionStyled>
          <Markdown>{description}</Markdown>
        </ConceptItemDescriptionStyled>
      )}

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
