export interface Topic {
  id: string
  slug: string
  title: string
  excerpt: string
  eventAt: string
  publishedAt: string
  projectId?: string
  taskId?: string
}

export const topics: Topic[] = [
  {
    id: 'topic-modx-history',
    slug: 'modx-history',
    title: 'Почему я начал с MODX в 2008-м',
    excerpt:
      'Контекст эпохи: PHP 5, отсутствие нормальных CMS под кастомизацию, ставка на гибкость шаблонов.',
    eventAt: '2008-04-15',
    publishedAt: '2026-06-10',
    projectId: 'p-happybaby',
  },
  {
    id: 'topic-agent-shape',
    slug: 'agent-shape',
    title: 'Форма агента: цикл, инструменты, память',
    excerpt:
      'Размышление о минимально полезной архитектуре автономного агента.',
    eventAt: '2025-12-04',
    publishedAt: '2026-01-08',
    projectId: 'p-agent-engine',
  },
  {
    id: 'topic-knowledge-as-os',
    slug: 'knowledge-as-os',
    title: 'Знание как личная операционная система',
    excerpt:
      'Что меняется, когда твой граф знаний становится единым адресным пространством.',
    eventAt: '2026-03-19',
    publishedAt: '2026-04-02',
    projectId: 'p-knowledge-graph',
  },
  {
    id: 'topic-agent-memory-hybrid',
    slug: 'agent-memory-hybrid',
    title: 'Гибрид граф + векторный поиск как память агента',
    excerpt:
      'Замена чистого k-NN на гибрид дала +27% точности на тестовом наборе.',
    eventAt: '2026-06-02',
    publishedAt: '2026-06-08',
    taskId: 't-agent-memory',
  },
  {
    id: 'topic-url-history',
    slug: 'url-history',
    title: '18 лет SEO-истории нельзя терять',
    excerpt:
      'Почему карта редиректов на edge-уровне — единственный реалистичный путь.',
    eventAt: '2026-05-30',
    publishedAt: '2026-06-09',
    taskId: 't-url-preservation',
  },
  {
    id: 'topic-public-journal',
    slug: 'public-journal',
    title: 'Зачем вести инженерный журнал публично',
    excerpt: 'О разнице между блогом, портфолио и реальным журналом работы.',
    eventAt: '2026-05-01',
    publishedAt: '2026-05-12',
  },
  {
    id: 'topic-evolution-of-tools',
    slug: 'evolution-of-tools',
    title: 'Эволюция инструментов за 18 лет',
    excerpt: 'От FTP и блокнота до агентов, пишущих код вместе со мной.',
    eventAt: '2026-04-20',
    publishedAt: '2026-04-25',
  },
]
