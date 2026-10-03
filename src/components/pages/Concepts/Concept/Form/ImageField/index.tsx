import React, { useCallback } from 'react'
import { ConceptEditFormImageWrapperStyled } from '../styles'
import { FileUploader, FileUploaderProps } from 'src/components/FileUploader'
import { TextField } from 'src/ui-kit/controls/TextField'
import { useFormContext } from 'react-hook-form'
import { ConceptFormData } from '../interfaces'

type ImageFieldProps = React.InputHTMLAttributes<HTMLInputElement> &
  FileUploaderProps & { value: string }

export const ImageField: React.FC<ImageFieldProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const form = useFormContext<ConceptFormData>()

  const onChangeImage = useCallback<NonNullable<FileUploaderProps['onChange']>>(
    (file) => {
      form.setValue('image', file?.path ?? null, {
        shouldValidate: true,
      })
    },
    [form],
  )

  return (
    <ConceptEditFormImageWrapperStyled>
      <FileUploader
        key={value}
        value={value ? `/images/resized/middle/${value}` : ''}
        onChange={onChangeImage}
      />
      <TextField value={value ?? ''} onChange={onChange} onBlur={onBlur} />
    </ConceptEditFormImageWrapperStyled>
  )
}
