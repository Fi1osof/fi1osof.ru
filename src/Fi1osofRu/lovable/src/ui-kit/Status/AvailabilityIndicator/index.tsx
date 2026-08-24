import type React from 'react'
import { AvailabilityStyled, AvailabilityDotStyled } from './styles'
import type { AvailabilityIndicatorProps } from './types'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { commonLexicon } from 'src/Fi1osofRu/Lexicon/commonLexicon'

export const AvailabilityIndicator: React.FC<AvailabilityIndicatorProps> = ({
  status,
  label,
  ...other
}) => {
  const { t } = useLexicon(commonLexicon)

  return (
    <AvailabilityStyled {...other}>
      <AvailabilityDotStyled $status={status} />
      <span>{label ?? t(`availability.${status}`)}</span>
    </AvailabilityStyled>
  )
}
