import { FileDetailedFragment } from 'src/gql/generated'
import { FilesViewListStyled, FilesViewStyled } from './styles'
import { FileItem } from './FileItem'
import { Pagination } from 'src/components/Pagination'

type FilesViewProps = {
  files: FileDetailedFragment[]
  count: number
  limit: number
  page: number
}

export const FilesView: React.FC<FilesViewProps> = ({
  files,
  count,
  limit,
  page,
  ...other
}) => {
  const totalPages = count ? Math.ceil(count / limit) : 0

  return (
    <FilesViewStyled {...other}>
      <FilesViewListStyled>
        {files.map((n) => {
          return <FileItem key={n.id} file={n} variant="list" />
        })}
      </FilesViewListStyled>

      <Pagination currentPage={page} totalPages={totalPages} />
    </FilesViewStyled>
  )
}
