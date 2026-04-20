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
import Link from 'next/link'
import { ConceptItemVariant } from './interfaces'
import { UserLink } from 'src/components/Link/User'

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
      <Link href={`/concepts/${id}`}>
        <ConceptItemTitleStyled>{name || id}</ConceptItemTitleStyled>
      </Link>

      {type && <ConceptItemTypeStyled>{type}</ConceptItemTypeStyled>}

      {description && (
        <ConceptItemDescriptionStyled>
          <Markdown>{description}</Markdown>
        </ConceptItemDescriptionStyled>
      )}

      {contentBlock}

      <ConceptItemMetaStyled>
        <Link href={`/concepts/${id}`}>
          <FormattedDate value={concept.updatedAt} format="dateTimeShort" />
        </Link>
        {CreatedBy && <UserLink user={CreatedBy} />}
      </ConceptItemMetaStyled>
    </ConceptItemStyled>
  )
}
