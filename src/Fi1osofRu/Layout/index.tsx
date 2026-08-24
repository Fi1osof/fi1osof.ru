import { ChatWidget } from 'src/components/Chat/ChatWidget'
import { Fi1osofRuGlobalStyles } from '../lovable/src/ui-kit/GlobalStyles'
import { useRouter } from 'next/router'
import { Fi1osofRuLayoutStyled } from './styles'

export const Fi1osofRuLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()

  return (
    <>
      <Fi1osofRuGlobalStyles />

      <Fi1osofRuLayoutStyled
        currentPath={router.pathname}
        // onNavigate={console.log}
      >
        {children}

        <ChatWidget />
      </Fi1osofRuLayoutStyled>
    </>
  )
}
