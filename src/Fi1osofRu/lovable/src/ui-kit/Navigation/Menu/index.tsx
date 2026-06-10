import type React from 'react'
import { MenuStyled, MenuItemStyled, MenuLinkStyled } from './styles'
import type { MenuProps } from './types'

export const Menu: React.FC<MenuProps> = ({ items, ...other }) => (
  <MenuStyled {...other}>
    {items.map((item) => (
      <MenuItemStyled key={item.id}>
        <MenuLinkStyled
          href={item.href}
          // onClick={(e) => {
          //   if (onNavigate) {
          //     e.preventDefault()
          //     onNavigate(item)
          //   }
          // }}
        >
          {item.label}
        </MenuLinkStyled>
      </MenuItemStyled>
    ))}
  </MenuStyled>
)
