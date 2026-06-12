import { TimerFragment } from 'src/gql/generated'

export interface TimerIndicatorProps {
  active: TimerFragment | null | undefined
  taskTitle?: string
  elapsedLabel?: string
  href: string
  // onOpen?: (href: string) => void;
  onClickStop: React.MouseEventHandler<HTMLButtonElement> | undefined
  idleLabel?: string
}
