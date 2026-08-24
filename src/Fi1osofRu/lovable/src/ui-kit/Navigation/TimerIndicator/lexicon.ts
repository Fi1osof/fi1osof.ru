import { LexiconDict } from 'src/Fi1osofRu/Lexicon'

export const timerIndicatorLexicon: LexiconDict = {
  ru: {
    idle: {
      label: 'таймер не запущен',
      ariaLabel: 'Таймер не запущен — открыть журнал таймеров',
    },
    active: {
      ariaLabel: 'Активный таймер: {{title}}, {{elapsed}}',
      stop: 'Остановить таймер',
    },
  },
  en: {
    idle: {
      label: 'timer not running',
      ariaLabel: 'Timer not running — open timer log',
    },
    active: {
      ariaLabel: 'Active timer: {{title}}, {{elapsed}}',
      stop: 'Stop timer',
    },
  },
  vi: {
    idle: {
      label: 'bộ đếm thời gian không chạy',
      ariaLabel: 'Bộ đếm thời gian không chạy — mở nhật ký bộ đếm thời gian',
    },
    active: {
      ariaLabel: 'Bộ đếm thời gian đang hoạt động: {{title}}, {{elapsed}}',
      stop: 'Dừng bộ đếm thời gian',
    },
  },
}
