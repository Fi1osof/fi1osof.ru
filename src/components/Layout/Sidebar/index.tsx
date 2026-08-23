import React, { memo, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  SidebarContainer,
  SidebarOverlay,
  SidebarHeader,
  SidebarLogoIcon,
  SidebarLogoText,
  SidebarCollapseButton,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
  NavItemIcon,
  NavItemLabel,
  SidebarUserSection,
  UserAvatar,
} from './styles'
import { useAppContext } from 'src/components/AppContext'
import { UserLink } from 'src/components/Link/User'
import { UserStatusEnum } from 'src/gql/generated'

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

const LoginIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
)

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  accessPolicy?: 'active' | 'sudo'
}

const navItems: Array<NavItem | undefined> = [
  {
    label: 'Concepts',
    href: '/concepts',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  {
    label: 'Members',
    href: '/users',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    label: 'Admin',
    href: '/admin',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="9" x2="9" y2="21" />
      </svg>
    ),
    accessPolicy: 'sudo',
  },
  process.env.NEXT_PUBLIC_WORLD3D_ENABLED === 'true'
    ? {
        label: 'Metaverse',
        href: '/world3d',
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-1.6-.8L14 15h-4l-.9 1.2a2 2 0 0 1-1.6.8H4a2 2 0 0 1-2-2v-5z" />
            <path d="M7 8V6a5 5 0 0 1 10 0v2" />
            <line x1="10" y1="10" x2="10" y2="15" />
            <line x1="14" y1="10" x2="14" y2="15" />
          </svg>
        ),
      }
    : undefined,
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, openLoginForm } = useAppContext()
  const router = useRouter()

  const handleLogoClick = useCallback(() => {
    if (isOpen) {
      router.push('/')
    } else {
      onToggle()
    }
  }, [isOpen, onToggle, router])

  const navItemsPrepared = useMemo<Array<NavItem | undefined>>(() => {
    return navItems.filter((n) => {
      let allow: boolean

      switch (n?.accessPolicy) {
        case undefined:
          allow = true
          break
        case 'active':
          allow = user?.status === UserStatusEnum.ACTIVE
          break
        case 'sudo':
          allow = user?.sudo === true
          break
      }

      return allow ? n : undefined
    })
  }, [user?.status, user?.sudo])

  return (
    <>
      <SidebarOverlay $isOpen={isOpen} onClick={onToggle} />
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader $isOpen={isOpen}>
          <SidebarLogoIcon
            onClick={handleLogoClick}
            title={isOpen ? 'Go to home' : 'Expand sidebar'}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </SidebarLogoIcon>
          {isOpen && (
            <>
              <SidebarLogoText href="/" $isOpen={isOpen}>
                AI Agent
              </SidebarLogoText>
              <SidebarCollapseButton
                $isOpen={isOpen}
                onClick={onToggle}
                title="Collapse sidebar"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                </svg>
              </SidebarCollapseButton>
            </>
          )}
        </SidebarHeader>

        <SidebarNav $isOpen={isOpen}>
          {navItemsPrepared.map(
            (item) =>
              item && (
                <SidebarNavItem key={item.href} $isOpen={isOpen}>
                  <Link href={item.href}>
                    <NavItemIcon>{item.icon}</NavItemIcon>
                    <NavItemLabel $isOpen={isOpen}>{item.label}</NavItemLabel>
                  </Link>
                </SidebarNavItem>
              ),
          )}
        </SidebarNav>

        <SidebarFooter>
          <SidebarUserSection $isOpen={isOpen}>
            {user ? (
              <UserLink user={user} showName={isOpen} size="small" />
            ) : (
              <button onClick={openLoginForm}>
                <UserAvatar>
                  <LoginIcon />
                </UserAvatar>
                {isOpen && <span>Sign in</span>}
              </button>
            )}
          </SidebarUserSection>
        </SidebarFooter>
      </SidebarContainer>
    </>
  )
}

export const SidebarMemo = memo(Sidebar)
