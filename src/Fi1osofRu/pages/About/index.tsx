import { Page } from 'src/components/pages/_App/interfaces'
import { JsonLd } from 'src/components/seo/JsonLd'
import {
  createPerson,
  createBreadcrumbList,
} from 'src/components/seo/JsonLd/helpers'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import {
  AboutPageCustomOwnPhotoStyled,
  AboutPageCustomStyled,
  AboutPageContentStyled,
  AboutPageTextStyled,
  AboutSectionStyled,
  AboutSectionTitleStyled,
  CtaSectionStyled,
  CtaTitleStyled,
  CtaDescriptionStyled,
  CraButtonStyled,
} from './styles'

import iAm from './img/i-am.jpg'

import { useOpenChatWithMessage } from 'src/components/Chat/hooks/useOpenChatWithMessage'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { aboutLexicon } from './lexicon'

export const AboutPageCustom: Page = ({ siteOrigin }) => {
  const { t } = useLexicon(aboutLexicon)

  const siteTitle = t('seo.title')
  const description = t('seo.description')

  const siteUrl = siteOrigin
  const pageUrl = `${siteUrl}/about`

  const onClickHandler = useOpenChatWithMessage()

  return (
    <>
      <SeoHeaders
        title={siteTitle}
        description={description}
        siteOrigin={siteOrigin}
        canonical={'/about'}
      />

      {siteUrl && (
        <JsonLd
          data={createPerson({
            '@id': 'https://fi1osof.ru/about',
            name: 'Nikolay Lanets',
            alternateName: ['Николай Ланец', 'Fi1osof'],
            url: pageUrl,
            image:
              'https://fi1osof.ru/images/resized/middle/cmkppub1z0002mu0z427kxsay/1788907935190-photo_2026-05-18_01-31-10.jpg',
            jobTitle: 'Systems Architect & AI Researcher',
            description:
              'Systems architect specializing in AI-native product development, technology foresight, and building intelligent systems that bridge human expertise with machine capabilities.',
            sameAs: [
              'https://github.com/fi1osof',
              'https://www.linkedin.com/in/fi1osof',
              'https://habr.com/ru/users/fi1osof/',
              'https://modx.pro/users/real-fi1osof',
              'https://npmx.dev/~fi1osof',
              'https://freecode.academy/profile/Fi1osof',
              'https://web3.bio/fi1osof.lens',
            ],
            knowsAbout: [
              'Futurist',
              'Systems Architecture',
              'AI Research',
              'AI-native Systems',
              'Product Development',
              'Technology Foresight',
              'Full-stack Development',
              'Knowledge Graphs',
              'Distributed Systems',
              'AI/ML Integration',
              'LLM Agents',
            ],
          })}
        />
      )}

      {siteOrigin && (
        <JsonLd
          data={createBreadcrumbList({
            siteOrigin,
            items: [
              { name: t('seo.breadcrumb.home'), url: '/' },
              { name: t('seo.breadcrumb.about') },
            ],
          })}
        />
      )}

      <AboutPageCustomStyled>
        <AboutPageContentStyled>
          <AboutPageCustomOwnPhotoStyled
            src={iAm.src}
            alt={t('image.alt')}
            width={iAm.width}
            height={iAm.height}
          />

          <AboutPageTextStyled>
            <AboutSectionStyled>
              <AboutSectionTitleStyled>
                {t('section.who.title')}
              </AboutSectionTitleStyled>
              <p>{t('section.who.text')}</p>
            </AboutSectionStyled>

            <AboutSectionStyled>
              <AboutSectionTitleStyled>
                {t('section.experience.title')}
              </AboutSectionTitleStyled>
              <p>{t('section.experience.text1')}</p>
              <p>
                {t('section.experience.text2')}{' '}
                <a href="https://modx.club/about" target="_blank">
                  {t('section.experience.modxClub')}
                </a>
                .
              </p>
            </AboutSectionStyled>

            <AboutSectionStyled>
              <AboutSectionTitleStyled>
                {t('section.current.title')}
              </AboutSectionTitleStyled>
              <p>{t('section.current.text1')}</p>
              <p>{t('section.current.text2')}</p>
            </AboutSectionStyled>
          </AboutPageTextStyled>
        </AboutPageContentStyled>

        <CtaSectionStyled>
          <CtaTitleStyled>{t('cta.title')}</CtaTitleStyled>
          <CtaDescriptionStyled>{t('cta.description')}</CtaDescriptionStyled>
          <CraButtonStyled onClick={onClickHandler} value={t('cta.button')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {t('cta.buttonIcon')}
          </CraButtonStyled>
        </CtaSectionStyled>
      </AboutPageCustomStyled>
    </>
  )
}
