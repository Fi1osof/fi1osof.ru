import { LexiconDict } from 'src/Fi1osofRu/Lexicon'

export const workLogLexicon: LexiconDict = {
  ru: {
    seo: {
      title: 'Ворклог',
      description: 'Страница ворклога',
      descriptionWithTask: 'Ворклог по задаче "{{taskTitle}}"',
    },
    title: 'Ворклог',
    titleWithTask: 'Ворклог по задаче "{{taskTitle}}"',
    taskPrefix: 'Задача: ',
  },
  en: {
    seo: {
      title: 'Worklog',
      description: 'Worklog page',
      descriptionWithTask: 'Worklog for task "{{taskTitle}}"',
    },
    title: 'Worklog',
    titleWithTask: 'Worklog for task "{{taskTitle}}"',
    taskPrefix: 'Task: ',
  },
  vi: {
    seo: {
      title: 'Nhật ký công việc',
      description: 'Trang nhật ký công việc',
      descriptionWithTask: 'Nhật ký công việc cho nhiệm vụ "{{taskTitle}}"',
    },
    title: 'Nhật ký công việc',
    titleWithTask: 'Nhật ký công việc cho nhiệm vụ "{{taskTitle}}"',
    taskPrefix: 'Nhiệm vụ: ',
  },
}
