import type React from 'react'
import {
  TimerWrapStyled,
  DotStyled,
  TimeStyled,
  TitleLinkStyled,
  StopButtonStyled,
} from './styles'
import type { TimerIndicatorProps } from './types'

export const TimerIndicator: React.FC<TimerIndicatorProps> = ({
  active,
  taskTitle,
  elapsedLabel,
  href,
  // onOpen,
  onClickStop,
  idleLabel = 'таймер не запущен',
}) => {
  if (active) {
    return (
      <TimerWrapStyled
        $active
        role="status"
        aria-label={`Активный таймер: ${taskTitle}, ${elapsedLabel}`}
      >
        <DotStyled $active />
        <TimeStyled $active>{elapsedLabel}</TimeStyled>
        <TitleLinkStyled
          $active
          href={href}
          title={taskTitle}
          // onClick={(e) => {
          //   if (onOpen) {
          //     e.preventDefault()
          //     onOpen(href)
          //   }
          // }}
        >
          {taskTitle}
        </TitleLinkStyled>
        {onClickStop && (
          <StopButtonStyled
            type="button"
            aria-label="Остановить таймер"
            onClick={onClickStop}
            value={active.id}
          >
            ■
          </StopButtonStyled>
        )}
      </TimerWrapStyled>
    )
  }

  return (
    <TimerWrapStyled
      role="status"
      aria-label="Таймер не запущен — открыть журнал таймеров"
    >
      <DotStyled />
      <TitleLinkStyled
        href={href}
        title={idleLabel}
        // onClick={(e) => {
        //   if (onOpen) {
        //     e.preventDefault()
        //     onOpen(href)
        //   }
        // }}
      >
        {idleLabel}
      </TitleLinkStyled>
    </TimerWrapStyled>
  )
}
