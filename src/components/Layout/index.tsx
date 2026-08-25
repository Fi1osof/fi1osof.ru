import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  LayoutContentStyled,
  LayoutStyled,
  LayoutMain,
  LayoutTopBar,
  MobileMenuButton,
  LayoutInnerContainer,
} from './styles'
import { SidebarMemo } from './Sidebar'
import dynamic from 'next/dynamic'

const ChatContent = dynamic(
  () =>
    import('src/components/Chat/ChatWidget/ChatContent').then(
      (r) => r.ChatContent,
    ),
  {
    ssr: false,
  },
)

const ChatWidget = dynamic(
  () => import('../Chat/ChatWidget').then((r) => r.ChatWidget),
  {
    ssr: false,
  },
)

type LayoutProps = React.PropsWithChildren

export const Layout: React.FC<LayoutProps> = ({ children, ...other }) => {
  const router = useRouter()
  const isHomePage = router.pathname === '/'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const chatContent = <ChatContent />

  return (
    <LayoutStyled {...other}>
      <SidebarMemo isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <LayoutMain $sidebarOpen={sidebarOpen}>
        <LayoutTopBar>
          <MobileMenuButton onClick={toggleSidebar}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </MobileMenuButton>
        </LayoutTopBar>

        <LayoutContentStyled $isHomePage={isHomePage}>
          <LayoutInnerContainer>
            {children}
            {isHomePage && chatContent}
          </LayoutInnerContainer>
        </LayoutContentStyled>
      </LayoutMain>

      {!isHomePage && <ChatWidget />}
    </LayoutStyled>
  )
}
