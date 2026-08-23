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

export const AboutPageCustom: Page = ({ siteOrigin }) => {
  const siteTitle = 'Николай Ланец (Fi1osof) — Fullstack AI Researcher'

  const description =
    'Fullstack-разработчик с 2007 года, основатель MODX-Клуба. Исследую практическое применение ИИ и развиваю собственного ИИ-агента с памятью и обучением через общение.'

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
            name: 'Николай Fi1osof Ланец',
            url: pageUrl,
            image: `${siteUrl}${iAm.src}`,
            jobTitle: 'Fullstack AI Researcher',
            description,
            sameAs: [
              'https://t.me/Fi1osof',
              'https://github.com/fi1osof',
              'https://www.linkedin.com/in/fi1osof/',
            ],
            knowsAbout: [
              'React',
              'Next.js',
              'TypeScript',
              'Node.js',
              'GraphQL',
              'Prisma',
              'Docker',
              'AI/ML Integration',
              'LLM Agents',
              'Prompt Engineering',
              'n8n Automation',
              'Three.js',
              'Styled Components',
              'openrouter API',
              'Comfy-UI',
            ],
          })}
        />
      )}

      {siteOrigin && (
        <JsonLd
          data={createBreadcrumbList({
            siteOrigin,
            items: [{ name: 'Главная', url: '/' }, { name: 'Обо мне' }],
          })}
        />
      )}

      <AboutPageCustomStyled>
        <AboutPageContentStyled>
          <AboutPageCustomOwnPhotoStyled
            src={iAm.src}
            alt="Николай Ланец aka Fi1osof"
            width={iAm.width}
            height={iAm.height}
          />

          <AboutPageTextStyled>
            <AboutSectionStyled>
              <AboutSectionTitleStyled>Кто я</AboutSectionTitleStyled>
              <p>
                Меня зовут Николай Ланец, также известен под ником Fi1osof.
                Активно программирую с 2007 года и являюсь специалистом широкого
                профиля с глубокой экспертизой, способным реализовывать проекты
                под ключ с нуля.
              </p>
            </AboutSectionStyled>

            <AboutSectionStyled>
              <AboutSectionTitleStyled>Опыт</AboutSectionTitleStyled>
              <p>
                Работал как на фрилансе, так и в крупном бигтехе, включая
                СберЛаб виртуальной и дополненной реальности. Там я проработал
                полтора года в роли тимлида/техлида и ведущего программиста на
                проекте собственной метавселенной Сбера.
              </p>
              <p>
                В период с 2009 по 2015 год активно занимался MODX и являлся
                одним из сильнейших специалистов в этой области. В 2013 году
                запустил{' '}
                <a href="https://modx.club/about" target="_blank">
                  MODX-Клуб
                </a>
                .
              </p>
            </AboutSectionStyled>

            <AboutSectionStyled>
              <AboutSectionTitleStyled>
                Чем занимаюсь сейчас
              </AboutSectionTitleStyled>
              <p>
                В феврале 2026 года я уволился из европейской компании Bringo
                Ltd, чтобы полностью погрузиться в исследования в области
                практического применения ИИ.
              </p>
              <p>
                Среди прочего развиваю собственного ИИ-агента, который гораздо
                больше, чем просто «говорилка». Этот агент имеет собственную
                память и обучается в формате, более близком к человеческому —
                через общение, рассуждения и практику.
              </p>
            </AboutSectionStyled>
          </AboutPageTextStyled>
        </AboutPageContentStyled>

        <CtaSectionStyled>
          <CtaTitleStyled>Хотите узнать больше?</CtaTitleStyled>
          <CtaDescriptionStyled>
            Пообщайтесь с моим ИИ-агентом — он расскажет обо мне и моих проектах
          </CtaDescriptionStyled>
          <CraButtonStyled
            onClick={onClickHandler}
            value={'Расскажи подробней про Николая и о себе'}
          >
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
            Начать диалог с ИИ
          </CraButtonStyled>
        </CtaSectionStyled>
      </AboutPageCustomStyled>
    </>
  )
}
