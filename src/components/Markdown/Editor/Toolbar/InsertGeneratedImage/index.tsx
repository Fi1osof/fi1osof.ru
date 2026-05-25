import React, { useCallback, useState } from 'react'
import { useCellValue, usePublisher } from '@mdxeditor/gurx'
import { iconComponentFor$, insertImage$, readOnly$ } from '@mdxeditor/editor'
import { Modal } from 'src/ui-kit/Modal'
import { FileUploader } from 'src/components/FileUploader'
import { FileFragment } from 'src/gql/generated'
import { InsertGeneratedImageButtonStyled } from './styles'

export const InsertGeneratedImage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const insertImage = usePublisher(insertImage$)
  const iconComponentFor = useCellValue(iconComponentFor$)
  const readOnly = useCellValue(readOnly$)

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleImageSelect = useCallback(
    (file: FileFragment | null) => {
      if (file?.path) {
        insertImage({
          src: `/images/resized/middle/${file.path}`,
          altText: '',
        })
        setIsOpen(false)
      }
    },
    [insertImage],
  )

  if (readOnly) {
    return null
  }

  return (
    <>
      <InsertGeneratedImageButtonStyled
        onClick={handleOpen}
        title="Generate image"
      >
        {iconComponentFor('add_photo')}
      </InsertGeneratedImageButtonStyled>

      <Modal isOpen={isOpen} onClose={handleClose} title="Add image">
        <FileUploader onChange={handleImageSelect} />
      </Modal>
    </>
  )
}
