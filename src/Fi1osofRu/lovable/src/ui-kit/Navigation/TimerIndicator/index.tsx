import type React from 'react'
import {
  TimerWrapStyled,
  DotStyled,
  TimeStyled,
  TitleLinkStyled,
  StopButtonStyled,
} from './styles'
import type { TimerIndicatorProps } from './types'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { timerIndicatorLexicon } from './lexicon'

export const TimerIndicator: React.FC<TimerIndicatorProps> = ({
  active,
  taskTitle,
  elapsedLabel,
  href,
  // onOpen,
  onClickStop,
  idleLabel,
}) => {
  const { t } = useLexicon(timerIndicatorLexicon)

  const resolvedIdleLabel = idleLabel || t('idle.label')

  if (active) {
    return (
      <TimerWrapStyled
        $active
        role="status"
        aria-label={t('active.ariaLabel', {
          title: taskTitle,
          elapsed: elapsedLabel,
        })}
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
            aria-label={t('active.stop')}
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
    <TimerWrapStyled role="status" aria-label={t('idle.ariaLabel')}>
      <DotStyled />
      <TitleLinkStyled
        href={href}
        title={resolvedIdleLabel}
        // onClick={(e) => {
        //   if (onOpen) {
        //     e.preventDefault()
        //     onOpen(href)
        //   }
        // }}
      >
        {resolvedIdleLabel}
      </TitleLinkStyled>
    </TimerWrapStyled>
  )
}
