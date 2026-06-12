import type React from 'react'
import { useCallback } from 'react'
import { Container } from '../../Layout/Container'
import {
  HeaderStyled,
  HeaderInnerStyled,
  HeaderBrandStyled,
  HeaderNameStyled,
  HeaderTaglineStyled,
  HeaderNavStyled,
  HeaderLinkStyled,
  BurgerButtonStyled,
  BurgerLineStyled,
  MobilePanelStyled,
  MobileLinkStyled,
  HeaderTimerSlotStyled,
} from './styles'
import type { HeaderProps } from './types'
import { useBoolean } from 'src/hooks/useBoolean'
import { HeaderTimer } from './Timer'

export const Header: React.FC<HeaderProps> = ({
  name,
  tagline,
  nav,
  // onNavigate,
  ...other
}) => {
  const [opened, , openedOff, openedToggle] = useBoolean(false)

  const handle = useCallback(() => {
    openedOff()
    // onNavigate?.(item)
  }, [openedOff])

  return (
    <HeaderStyled {...other}>
      <Container size="wide">
        <HeaderInnerStyled>
          <HeaderBrandStyled
            href="/"
            // onClick={(e) => {
            //   if (onNavigate) {
            //     e.preventDefault()
            //     handle({ id: 'home', label: name, href: '/' })
            //   }
            // }}
          >
            <HeaderNameStyled>{name}</HeaderNameStyled>
            <HeaderTaglineStyled>{tagline}</HeaderTaglineStyled>
          </HeaderBrandStyled>

          <HeaderTimerSlotStyled>
            <HeaderTimer />
          </HeaderTimerSlotStyled>

          <HeaderNavStyled>
            {nav.map((item) => (
              <HeaderLinkStyled
                key={item.id}
                href={item.href}
                $active={item.active}
                // onClick={(e) => {
                //   if (onNavigate) {
                //     e.preventDefault()
                //     handle(item)
                //   }
                // }}
                onClick={handle}
              >
                {item.label}
              </HeaderLinkStyled>
            ))}
          </HeaderNavStyled>

          <BurgerButtonStyled
            type="button"
            aria-label="меню"
            aria-expanded={opened}
            $open={opened}
            onClick={openedToggle}
          >
            <BurgerLineStyled />
            <BurgerLineStyled />
            <BurgerLineStyled />
          </BurgerButtonStyled>
        </HeaderInnerStyled>

        {opened && (
          <MobilePanelStyled>
            {nav.map((item) => (
              <MobileLinkStyled
                key={item.id}
                href={item.href}
                $active={item.active}
                onClick={handle}
                // onClick={(e) => {
                //   if (onNavigate) {
                //     e.preventDefault()
                //     handle(item)
                //   }
                // }}
              >
                {item.label}
              </MobileLinkStyled>
            ))}
          </MobilePanelStyled>
        )}
      </Container>
    </HeaderStyled>
  )
}
