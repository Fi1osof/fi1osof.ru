import Link from 'next/link'
import styled from 'styled-components'

export const HeroStyled = styled.header`
  padding: ${({ theme }) => theme.space(6)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.hairline};
  margin-bottom: ${({ theme }) => theme.space(6)};
`

export const TitleStyled = styled.h1`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: ${({ theme }) => theme.size.h1};
  letter-spacing: -0.02em;
  margin: ${({ theme }) => theme.space(3)} 0 ${({ theme }) => theme.space(2)};
  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    font-size: ${({ theme }) => theme.size.h2};
  }
`

export const DescStyled = styled.p`
  color: ${({ theme }) => theme.color.inkMuted};
  max-width: 720px;
  font-size: ${({ theme }) => theme.size.lg};
  line-height: 1.55;
`

export const StatsRowStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(6)};
  margin-top: ${({ theme }) => theme.space(5)};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};
  text-transform: uppercase;
  letter-spacing: 0.04em;

  > div {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.space(1)};
  }

  strong {
    font-family: ${({ theme }) => theme.font.serif};
    font-size: ${({ theme }) => theme.size.h3};
    font-weight: 500;
    color: ${({ theme }) => theme.color.ink};
    letter-spacing: -0.01em;
  }
`

export const EntryListStyled = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

export const EntryStyled = styled.li<{ $live?: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => theme.space(4)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.hairline};
  background: ${({ $live, theme }) =>
    $live ? theme.color.warmSoft : 'transparent'};
  ${({ $live, theme }) =>
    $live &&
    `
    margin: 0 -${theme.space(3)};
    padding-left: ${theme.space(3)};
    padding-right: ${theme.space(3)};
    border: 1px solid ${theme.color.warm};
    border-radius: ${theme.radius.md};
    margin-bottom: ${theme.space(3)};
  `}
`

export const EntryMainStyled = styled.div`
  min-width: 0;
`

export const EntryTitleStyled = styled(Link)`
  display: inline-block;
  font-family: ${({ theme }) => theme.font.serif};
  font-size: ${({ theme }) => theme.size.lg};
  color: ${({ theme }) => theme.color.ink};
  text-decoration: none;
  margin-bottom: ${({ theme }) => theme.space(1)};
  &:hover {
    color: ${({ theme }) => theme.color.accent};
  }
`

export const EntryDescStyled = styled.p`
  margin: 0 0 ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.color.inkMuted};
  font-size: ${({ theme }) => theme.size.sm};
  line-height: 1.5;
`

export const EntryMetaStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(4)};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.inkSubtle};

  span b {
    font-weight: 500;
    color: ${({ theme }) => theme.color.inkMuted};
  }
`

export const EntryAsideStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space(2)};
  font-family: ${({ theme }) => theme.font.mono};
  text-align: right;
`

export const DurationStyled = styled.div<{ $live?: boolean }>`
  font-size: ${({ theme }) => theme.size.h3};
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: ${({ $live, theme }) => ($live ? theme.color.warm : theme.color.ink)};
`

export const LiveBadgeStyled = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  font-size: ${({ theme }) => theme.size.xs};
  color: ${({ theme }) => theme.color.warm};
  text-transform: uppercase;
  letter-spacing: 0.06em;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.warm};
    animation: pulse 1.4s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }
`

export const StopBtnStyled = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.warm};
  color: ${({ theme }) => theme.color.warm};
  padding: 4px 10px;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.color.warm};
    color: #fff;
  }
`

export const EmptyStyled = styled.div`
  padding: ${({ theme }) => theme.space(10)} 0;
  text-align: center;
  color: ${({ theme }) => theme.color.inkSubtle};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.size.sm};
  border: 1px dashed ${({ theme }) => theme.color.hairline};
  border-radius: ${({ theme }) => theme.radius.md};
`
