import { FileDetailedFragment, MeUserFragment } from 'src/gql/generated'
import { FileItem } from '../../View/FileItem'
import { useBoolean } from 'src/hooks/useBoolean'
import { FileEditForm } from '../Form'
import { Button } from 'src/ui-kit/Button'
import { FileViewStyled } from './styles'

type FileViewProps = {
  file: FileDetailedFragment
  currentUser: MeUserFragment | null | undefined
}

export const FileView: React.FC<FileViewProps> = ({ file, currentUser }) => {
  const [inEditMode, startEdit, stopEdit] = useBoolean()

  return (
    <FileViewStyled>
      {inEditMode ? (
        <FileEditForm file={file} cancelHandler={stopEdit} />
      ) : (
        <>
          <FileItem file={file} variant="full" />

          {currentUser?.sudo && (
            <div>
              <Button onClick={startEdit}>Edit</Button>
            </div>
          )}
        </>
      )}
    </FileViewStyled>
  )
}
