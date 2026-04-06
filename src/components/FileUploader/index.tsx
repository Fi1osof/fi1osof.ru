import React, { useCallback, useRef, useState } from 'react'
import { useSingleUploadMutation, FileFragment } from 'src/gql/generated'
import {
  FileUploaderStyled,
  DropZoneStyled,
  PreviewStyled,
  RemoveButtonStyled,
  ErrorMessageStyled,
  LoadingOverlayStyled,
} from './styles'

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]
const MAX_FILE_SIZE = 10 * 1024 * 1024

export interface FileUploaderProps {
  value?: string | null
  onChange?: (file: FileFragment | null) => void
  directory?: string
  disabled?: boolean
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  value,
  onChange,
  directory,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [uploadFile, { loading }] = useSingleUploadMutation()

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setError('Allowed types: JPEG, PNG, GIF, WebP')
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`Max size — ${MAX_FILE_SIZE}MB`)
        return
      }

      const localPreview = URL.createObjectURL(file)
      setPreview(localPreview)

      try {
        const result = await uploadFile({
          variables: {
            data: {
              file,
              directory,
            },
          },
        })

        if (result.data?.singleUpload) {
          onChange?.(result.data.singleUpload)
        } else {
          setError('Unhandled error')
          setPreview(value || null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unhandled error')
        setPreview(value || null)
      }
    },
    [uploadFile, directory, onChange, value],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled || loading) {
        return
      }

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile, disabled, loading],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = useCallback(() => {
    if (!disabled && !loading) {
      inputRef.current?.click()
    }
  }, [disabled, loading])

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setPreview(null)
      setError(null)
      onChange?.(null)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    },
    [onChange],
  )

  return (
    <FileUploaderStyled>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={handleInputChange}
        disabled={disabled || loading}
        style={{ display: 'none' }}
      />

      <DropZoneStyled
        $isDragging={isDragging}
        $hasPreview={!!preview}
        $disabled={disabled || loading}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {loading && (
          <LoadingOverlayStyled>
            <span>Загрузка...</span>
          </LoadingOverlayStyled>
        )}

        {preview ? (
          <PreviewStyled>
            <img src={preview} alt="Preview" />
            {!disabled && !loading && (
              <RemoveButtonStyled onClick={handleRemove}>×</RemoveButtonStyled>
            )}
          </PreviewStyled>
        ) : (
          <span>
            {isDragging
              ? 'Drop file'
              : 'Drop image here or click to select file'}
          </span>
        )}
      </DropZoneStyled>

      {error && <ErrorMessageStyled>{error}</ErrorMessageStyled>}
    </FileUploaderStyled>
  )
}
