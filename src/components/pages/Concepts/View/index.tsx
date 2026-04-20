import { KbConceptFragment } from 'src/gql/generated'
import { ConceptsViewListStyled, ConceptsViewStyled } from './styles'
import { ConceptItem } from './ConceptItem'
import { Pagination } from 'src/components/Pagination'

type ConceptsViewProps = {
  concepts: KbConceptFragment[]
  count: number
  limit: number
  page: number
}

export const ConceptsView: React.FC<ConceptsViewProps> = ({
  concepts,
  count,
  limit,
  page,
  ...other
}) => {
  const totalPages = count ? Math.floor(count / limit) + 1 : 0

  return (
    <ConceptsViewStyled {...other}>
      <ConceptsViewListStyled>
        {concepts.map((n) => {
          return <ConceptItem key={n.id} concept={n} variant="list" />
        })}
      </ConceptsViewListStyled>

      <Pagination currentPage={page} totalPages={totalPages} />
    </ConceptsViewStyled>
  )
}
