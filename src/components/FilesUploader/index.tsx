import {
  useFilesUploader,
  useFilesUploaderProps,
} from './hooks/useFilesUploader'
import {
  DropZoneStyled,
  FileInfoStyled,
  FileItemStyled,
  FileListStyled,
  FileNameStyled,
  FileSizeStyled,
  FileStatusStyled,
  FilesUploaderStyled,
  ProgressBarStyled,
  ProgressFillStyled,
} from './styles'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type FilesUploaderProps = {
  onUploadComplete?: useFilesUploaderProps['onUploadComplete']
}

export const FilesUploader: React.FC<FilesUploaderProps> = ({
  onUploadComplete,
}) => {
  const { input, files, isDragging, getRootProps } = useFilesUploader({
    multiple: true,
    onUploadComplete,
  })

  return (
    <FilesUploaderStyled>
      {input}

      <DropZoneStyled {...getRootProps()} $isDragging={isDragging}>
        {isDragging
          ? 'Drop files to upload'
          : 'Drag files here or click to select'}
      </DropZoneStyled>

      {files.length > 0 && (
        <FileListStyled>
          {files.map((file) => (
            <FileItemStyled key={file.id}>
              <FileInfoStyled>
                <FileNameStyled>{file.name}</FileNameStyled>
                <FileSizeStyled>
                  {formatFileSize(file.size)} · {file.type || 'unknown'}
                </FileSizeStyled>
              </FileInfoStyled>

              {file.status === 'uploading' && (
                <ProgressBarStyled>
                  <ProgressFillStyled $progress={file.progress} />
                </ProgressBarStyled>
              )}

              {file.status !== 'uploading' && file.status !== 'pending' && (
                <FileStatusStyled $status={file.status}>
                  {file.status === 'success' && '✓'}
                  {file.status === 'error' && '✗'}
                  {file.status === 'cancelled' && '—'}
                </FileStatusStyled>
              )}
            </FileItemStyled>
          ))}
        </FileListStyled>
      )}
    </FilesUploaderStyled>
  )
}
