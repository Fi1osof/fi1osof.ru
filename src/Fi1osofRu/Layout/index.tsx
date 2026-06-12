import { ChatWidget } from 'src/components/Chat/ChatWidget'
import { Fi1osofRuGlobalStyles } from '../lovable/src/ui-kit/GlobalStyles'
import { LayoutNavItem } from '../lovable/src/ui-kit/Layout/Layout/types'
import { useRouter } from 'next/router'
import { Fi1osofRuLayoutStyled } from './styles'

const nav: LayoutNavItem[] = [
  {
    href: '/',
    id: 'now',
    label: 'Сейчас',
  },
  {
    href: '/projects',
    id: 'projects',
    label: 'Проекты',
  },
  {
    href: '/tasks',
    id: 'tasks',
    label: 'Задачи',
  },
  // {
  //   href: '/posts',
  //   id: 'posts',
  //   label: 'Заметки',
  // },
  {
    href: '/timers',
    id: 'timers',
    label: 'Журнал',
  },
]

export const Fi1osofRuLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()

  return (
    <>
      <Fi1osofRuGlobalStyles />

      <Fi1osofRuLayoutStyled
        nav={nav}
        currentPath={router.pathname}
        // onNavigate={console.log}
      >
        {children}

        <ChatWidget />
      </Fi1osofRuLayoutStyled>
    </>
  )
}
