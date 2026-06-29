import Image from 'next/image'
import { Container } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Container'
import { minWidth } from 'src/theme/helpers'
import styled, { css, keyframes } from 'styled-components'

export const AboutPageCustomStyled = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px 16px;
  font-size: 17px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.primary};

  ${minWidth.sm(css`
    padding: 32px 24px;
    font-size: 18px;
  `)}

  ${minWidth.md(css`
    padding: 48px 32px;
  `)}
`

export const AboutPageContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${minWidth.sm(css`
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
  `)}
`

export const AboutPageCustomOwnPhotoStyled = styled(Image)`
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  object-fit: contain;

  ${minWidth.sm(css`
    width: 280px;
    min-width: 280px;
    height: auto;
    order: 2;
  `)}

  ${minWidth.md(css`
    width: 320px;
    min-width: 320px;
  `)}
`

export const AboutPageTextStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${minWidth.sm(css`
    order: 1;
  `)}
`

export const AboutSectionStyled = styled.section`
  p {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`

export const AboutSectionTitleStyled = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text.primary};

  ${minWidth.sm(css`
    font-size: 22px;
  `)}
`

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
`

export const CtaSectionStyled = styled.section`
  margin-top: 8px;
  padding: 24px;
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  text-align: center;

  ${minWidth.sm(css`
    padding: 32px;
  `)}
`

export const CtaTitleStyled = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text.primary};

  ${minWidth.sm(css`
    font-size: 20px;
  `)}
`

export const CtaDescriptionStyled = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 20px;
  font-size: 15px;

  ${minWidth.sm(css`
    font-size: 16px;
  `)}
`

export const CraButtonStyled = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${pulse} 2s infinite;

  ${minWidth.sm(css`
    padding: 16px 32px;
    font-size: 17px;
  `)}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`
