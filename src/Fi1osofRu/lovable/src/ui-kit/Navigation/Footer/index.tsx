import type React from 'react'
import { Container } from '../../Layout/Container'
import {
  FooterStyled,
  FooterInnerStyled,
  FooterColStyled,
  FooterTitleStyled,
  FooterLinkStyled,
  FooterMetaStyled,
} from './styles'
import type { FooterProps } from './types'

import 'react'
import { TelegramIcon } from 'src/Fi1osofRu/icons/Telegram'
import { GitHubIcon } from 'src/Fi1osofRu/icons/GitHub'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { footerLexicon } from './lexicon'

export const Footer: React.FC<FooterProps> = ({
  nav,
  // onNavigate,
  year = new Date().getFullYear(),
}) => {
  const { t } = useLexicon(footerLexicon)

  return (
    <FooterStyled>
      <Container size="wide">
        <FooterInnerStyled>
          <FooterColStyled>
            <FooterTitleStyled>{t('title')}</FooterTitleStyled>
            <FooterMetaStyled>
              {t('meta.description')}
              <br />
              {t('meta.journal')}
            </FooterMetaStyled>
          </FooterColStyled>
          <FooterColStyled>
            <FooterTitleStyled>{t('nav.title')}</FooterTitleStyled>
            {nav.map((item) => (
              <FooterLinkStyled
                key={item.id}
                href={item.href}
                // onClick={(e) => {
                //   if (onNavigate) {
                //     e.preventDefault()
                //     onNavigate(item)
                //   }
                // }}
              >
                {item.label}
              </FooterLinkStyled>
            ))}
          </FooterColStyled>
          <FooterColStyled>
            <FooterTitleStyled>{t('contact.title')}</FooterTitleStyled>
            <FooterLinkStyled
              href="https://github.com/fi1osof"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon /> Fi1osof
            </FooterLinkStyled>

            <FooterLinkStyled
              href="https://t.me/Fi1osof"
              target="_blank"
              rel="noreferrer"
            >
              <TelegramIcon /> Fi1osof
            </FooterLinkStyled>
          </FooterColStyled>
        </FooterInnerStyled>
        <FooterMetaStyled style={{ marginTop: 24, opacity: 0.7 }}>
          © {year} fi1osof.ru · {t('copyright')}
        </FooterMetaStyled>
      </Container>
    </FooterStyled>
  )
}
