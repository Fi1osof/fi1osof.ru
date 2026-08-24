import type React from 'react'
// import { Container } from '../../ui-kit/Layout/Container'
// import { Section } from '../../ui-kit/Layout/Section'
// import { Breadcrumbs } from '../../ui-kit/Navigation/Breadcrumbs'
// import { formatElapsed, formatDateTime } from '../../lib/timer/TimerContext'
import {
  HeroStyled,
  TitleStyled,
  DescStyled,
  // StatsRowStyled,
  EntryListStyled,
  EntryStyled,
  EntryMainStyled,
  EntryTitleStyled,
  // EntryDescStyled,
  EntryMetaStyled,
  EntryAsideStyled,
  DurationStyled,
  LiveBadgeStyled,
  StopBtnStyled,
  // EmptyStyled,
} from './styles'
import { TimerFragment } from 'src/gql/generated'
import { Container } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Container'
import { Breadcrumbs } from 'src/Fi1osofRu/lovable/src/ui-kit/Navigation/Breadcrumbs'
import { formatDateTime } from '../helpers'
import { Section } from 'src/Fi1osofRu/lovable/src/ui-kit/Layout/Section'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { timersViewLexicon } from './lexicon'

interface TimersPageViewProps {
  active: TimerFragment | null
  // liveElapsedLabel: string
  entries: TimerFragment[] | undefined
  // hrefForTask: (slug: string) => string
  // onOpen: (href: string) => void
  // onStopActive: () => void
}

export const TimersPageView: React.FC<TimersPageViewProps> = ({
  active,
  // liveElapsedLabel,
  entries,
  // hrefForTask,
  // onOpen,
  // onStopActive,
}) => {
  const { t } = useLexicon(timersViewLexicon)

  // const totalMs =
  // entries?.reduce((s, e) => s + (e.stoppedAt - e.startedAt), 0) ?? []
  // const liveMs = active ? Date.now() - active.startedAt : 0
  // const uniqueTasks = new Set(entries.map((e) => e.taskId))

  // if (active) {
  //   uniqueTasks.add(active.taskId)
  // }

  return (
    <Container size="wide">
      <HeroStyled>
        <Breadcrumbs
          items={[
            { id: 'home', label: t('breadcrumbs.home'), href: '/' },
            { id: 'this', label: t('breadcrumbs.this') },
          ]}
          // onNavigate={(item) => item.href && onOpen(item.href)}
        />
        <TitleStyled>{t('hero.title')}</TitleStyled>
        <DescStyled>{t('hero.description')}</DescStyled>

        {/*
        TODO Проработать статистику?
        <StatsRowStyled>
          <div>
            всего записей<strong>{entries.length}</strong>
          </div>
          <div>
            задач затронуто<strong>{uniqueTasks.size}</strong>
          </div>
          <div>
            суммарно отработано
            <strong>{formatElapsed(totalMs + liveMs)}</strong>
          </div>
          <div>
            сейчас в работе<strong>{active ? '1' : '0'}</strong>
          </div>
        </StatsRowStyled> */}
      </HeroStyled>

      <Section eyebrow={t('sections.log')} title={t('sections.history')}>
        {/* {!active && entries.length === 0 && (
          <EmptyStyled>
            Пока ни одного запуска. Откройте любую задачу и нажмите «Запустить
            таймер».
          </EmptyStyled>
        )} */}

        <EntryListStyled>
          {active && (
            <EntryStyled $live>
              <EntryMainStyled>
                {active.Task && (
                  <>
                    <EntryTitleStyled
                      href={`/tasks/${active.Task.id}`}
                      // onClick={(e) => {
                      //   e.preventDefault()
                      //   onOpen(hrefForTask(active.taskSlug))
                      // }}
                    >
                      {active.Task.title}
                    </EntryTitleStyled>
                    {/* {active.taskProblem && (
                      <EntryDescStyled>{active.taskProblem}</EntryDescStyled>
                    )} */}
                  </>
                )}

                <EntryMetaStyled>
                  <span>
                    <b>{t('entry.started')}:</b>{' '}
                    {formatDateTime(active.startedAt)}
                  </span>
                  <span>
                    <b>{t('entry.stopped')}:</b> —
                  </span>
                </EntryMetaStyled>
              </EntryMainStyled>
              <EntryAsideStyled>
                <LiveBadgeStyled>{t('entry.inProgress')}</LiveBadgeStyled>
                {active.Task?.title && (
                  <DurationStyled $live>{active.Task.title}</DurationStyled>
                )}
                <StopBtnStyled
                  type="button"
                  // TODO Fix
                  // onClick={onStopActive}
                >
                  {t('entry.stop')}
                </StopBtnStyled>
              </EntryAsideStyled>
            </EntryStyled>
          )}

          {entries?.map((n) => {
            const { startedAt, stoppedAt } = n

            return (
              <EntryStyled key={n.id}>
                <EntryMainStyled>
                  {n.Task && (
                    <>
                      <EntryTitleStyled
                        href={`/tasks/${n.Task.id}`}
                        // onClick={(ev) => {
                        //   ev.preventDefault()
                        //   onOpen(hrefForTask(e.taskSlug))
                        // }}
                      >
                        {n.Task.title}
                      </EntryTitleStyled>
                      {/* {n.Task.intro && (
                      <EntryDescStyled>{n.Task.intro}</EntryDescStyled>
                    )} */}
                    </>
                  )}
                  <EntryMetaStyled>
                    <span>
                      <b>{t('entry.started')}:</b> {formatDateTime(startedAt)}
                    </span>
                    {stoppedAt && (
                      <span>
                        <b>{t('entry.stopped')}:</b> {formatDateTime(stoppedAt)}
                      </span>
                    )}
                  </EntryMetaStyled>
                </EntryMainStyled>
                {/* {stoppedAt && (
                <EntryAsideStyled>
                  <DurationStyled>
                    {formatElapsed(stoppedAt - startedAt)}
                  </DurationStyled>
                </EntryAsideStyled>
              )} */}
              </EntryStyled>
            )
          })}
        </EntryListStyled>
      </Section>
    </Container>
  )
}
