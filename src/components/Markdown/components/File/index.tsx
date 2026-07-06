import { useAppContext } from 'src/components/AppContext'
import { FileView } from 'src/components/pages/Files/File/View'
import { useFileQuery } from 'src/gql/generated'
import { MarkdownFileStyled } from './styles'

type MarkdownFileProps = {
  id: string
  fileName: React.ReactNode
}

export const MarkdownFile: React.FC<MarkdownFileProps> = ({ id }) => {
  const { user } = useAppContext()

  const response = useFileQuery({
    variables: {
      where: {
        id,
      },
    },
  })

  const file = response.data?.file

  return (
    file && (
      <MarkdownFileStyled>
        <FileView file={file} currentUser={user} />
      </MarkdownFileStyled>
    )
  )
}
