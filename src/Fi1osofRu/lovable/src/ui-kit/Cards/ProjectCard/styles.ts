import Link from 'next/link'
import styled from 'styled-components'

export const ProjectCardStyled = styled(Link)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.hairline};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 120ms ease,
    transform 120ms ease;
  &:hover {
    border-color: ${({ theme }) => theme.color.accent};
    transform: translateY(-1px);
  }
`

export const ProjectCardImageStyled = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: ${({ theme }) => theme.color.surfaceMuted};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export const ProjectCardBodyStyled = styled.div`
  padding: ${({ theme }) => theme.space(5)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  flex: 1;
`

export const ProjectCardHeadStyled = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(3)};
`

export const ProjectCardTitleStyled = styled.h3`
  font-size: ${({ theme }) => theme.size.lg};
  font-family: ${({ theme }) => theme.font.serif};
`

export const ProjectCardDescStyled = styled.div`
  color: ${({ theme }) => theme.color.inkMuted};
  font-size: ${({ theme }) => theme.size.sm};
  margin: 0;
  flex: 1;
`

export const ProjectCardMetaStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  align-items: center;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
`
