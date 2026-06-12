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
            { id: 'home', label: 'Fi1osof', href: '/' },
            { id: 'this', label: 'Таймеры' },
          ]}
          // onNavigate={(item) => item.href && onOpen(item.href)}
        />
        <TitleStyled>Журнал таймеров</TitleStyled>
        <DescStyled>
          Прозрачный учёт времени над задачами. Каждый запуск — публичная
          запись: когда начал, когда остановил, над чем работал. Это не
          таск-трекер для команды, а след инженерной деятельности в реальном
          времени.
        </DescStyled>

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

      <Section eyebrow="лог" title="История сессий">
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
                    <b>запущен:</b> {formatDateTime(active.startedAt)}
                  </span>
                  <span>
                    <b>остановлен:</b> —
                  </span>
                </EntryMetaStyled>
              </EntryMainStyled>
              <EntryAsideStyled>
                <LiveBadgeStyled>в работе</LiveBadgeStyled>
                {active.Task?.title && (
                  <DurationStyled $live>{active.Task.title}</DurationStyled>
                )}
                <StopBtnStyled
                  type="button"
                  // TODO Fix
                  // onClick={onStopActive}
                >
                  остановить
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
                      <b>запущен:</b> {formatDateTime(startedAt)}
                    </span>
                    {stoppedAt && (
                      <span>
                        <b>остановлен:</b> {formatDateTime(stoppedAt)}
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
