import React, { useRef, useEffect, useCallback } from 'react'
import { PopoverWrapper, PopoverContent, PopoverArrow } from './styles'

export type PopoverProps = React.HTMLAttributes<HTMLDivElement> & {
  item: React.ReactNode
  children: React.ReactNode
  opened: boolean
  onCloseHandler: () => void
}

export const Popover: React.FC<PopoverProps> = ({
  item,
  children,
  opened: isOpen,
  onCloseHandler,
  ...other
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        onCloseHandler()
      }
    },
    [onCloseHandler],
  )

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseHandler()
      }
    },
    [onCloseHandler],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleClickOutside, handleEscape])

  return (
    <PopoverWrapper ref={wrapperRef} {...other}>
      {children}

      <PopoverContent $isOpen={isOpen}>
        <PopoverArrow />
        {item}
      </PopoverContent>
    </PopoverWrapper>
  )
}
