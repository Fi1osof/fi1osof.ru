import { FileDetailedFragment } from 'src/gql/generated'
import {
  FileItemStyled,
  FileItemImageWrapperStyled,
  FileItemMetaStyled,
  FileItemErrorStyled,
  FileItemIconStyled,
  FileItemDownloadStyled,
  FileItemImgStyled,
  FileItemTitleStyled,
} from './styles'
import { UserLink } from 'src/components/Link/User'
import { FormattedDate } from 'src/ui-kit/format/FormattedDate'
import { useBoolean } from 'src/hooks/useBoolean'
import { getResizedImagePath } from 'src/helpers/getResizedImagePath'
import { getFileIcon, isImageMimetype } from './utils'
import { Markdown } from 'src/components/Markdown'
import Link from 'next/link'
import { FileItemVariant } from './interfaces'

type FileItemProps = {
  file: FileDetailedFragment
  variant: FileItemVariant
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  variant,
  ...other
}) => {
  const [hasError, setHasError] = useBoolean()

  const { id, path, mimetype, name, filename } = file
  const isImage = isImageMimetype(mimetype)

  const src = isImage
    ? getResizedImagePath({
        path: path,
        size: 'middle',
      })
    : null

  const fileName = path.split('/').pop() || 'file'
  const FileIcon = getFileIcon(mimetype, path)

  let content: React.ReactNode | null

  switch (variant) {
    case 'full':
      content = <>{file.content && <Markdown>{file.content}</Markdown>}</>

      break

    default:
      content = null
  }

  return (
    <FileItemStyled {...other} $variant={variant}>
      <FileItemImageWrapperStyled>
        {isImage ? (
          hasError ? (
            <FileItemErrorStyled>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Ошибка загрузки</span>
            </FileItemErrorStyled>
          ) : (
            src && <FileItemImgStyled src={src} alt="" onError={setHasError} />
          )
        ) : (
          <FileItemIconStyled>
            <FileIcon />
          </FileItemIconStyled>
        )}
      </FileItemImageWrapperStyled>

      <Link href={`files/${file.id}`}>
        <FileItemTitleStyled>{name || filename || id}</FileItemTitleStyled>
      </Link>

      {file.description && <Markdown>{file.description}</Markdown>}

      {content}

      <FileItemMetaStyled>
        <Link href={`files/${file.id}`}>
          <FormattedDate value={file.createdAt} format="dateTimeShort" />
        </Link>
        {file.CreatedBy && <UserLink user={file.CreatedBy} />}
      </FileItemMetaStyled>
      {!isImage && (
        <FileItemDownloadStyled
          href={path}
          download={fileName}
          title={filename || name || undefined}
        >
          Скачать
        </FileItemDownloadStyled>
      )}
    </FileItemStyled>
  )
}
