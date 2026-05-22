import { Button } from 'src/ui-kit/Button'
import styled from 'styled-components'

type ImageGenerationAspectRatioButtonStyledProps = {
  $aspectRatio: number
}

export const ImageGenerationAspectRatioButtonStyled = styled(
  Button,
)<ImageGenerationAspectRatioButtonStyledProps>`
  height: 60px;
  width: auto;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};

  font-size: 10px;
  transition: all 0.2s ease;
`

export const ImageGenerationAspectRatioStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0;
`
