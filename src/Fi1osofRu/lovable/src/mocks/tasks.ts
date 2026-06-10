import type { ActivityKind } from '../ui-kit/Status/ActivityIndicator/types'

export interface Worklog {
  id: string
  taskId?: string | null
  eventAt?: string
  publishedAt?: string | null
  body?: string | null
}

export interface Task {
  id: string
  slug: string
  title: string
  problem?: string | null
  context?: string | null
  status: ActivityKind
  projectId?: string | null
  parentId?: string | null
  relatedTasks?: string[] | null
  relatedTopics?: string[] | null
  worklogs: Worklog[] | null | undefined
  result?: string | null
  github?: { commits: number; prs: number; repos: string[] } | null
}

export const tasks: Task[] = [
  {
    id: 't-modx-migration',
    slug: 'modx-migration',
    title: 'Миграция MODX Evolution → современный стек',
    problem:
      'Старая БД с многолетней историей заказов и контента должна быть перенесена без потери данных и URL-адресов.',
    context:
      'Проект HappyBaby живёт с 2008 года. За это время в БД накопились нестандартные структуры, не описанные ни в одной документации.',
    status: 'research',
    projectId: 'p-happybaby',
    relatedTasks: ['t-url-preservation'],
    relatedTopics: ['topic-modx-history'],
    worklogs: [
      {
        id: 'w1',
        taskId: 't-modx-migration',
        eventAt: '2025-02-10',
        publishedAt: '2025-02-12',
        body: 'Извлёк схему БД, обнаружил 14 кастомных таблиц без FK. Размечаю связи вручную.',
      },
      {
        id: 'w2',
        taskId: 't-modx-migration',
        eventAt: '2025-04-22',
        publishedAt: '2025-05-01',
        body: 'Прототип ETL-скрипта: чтение из MODX → нормализованная модель → запись в Postgres.',
      },
      {
        id: 'w3',
        taskId: 't-modx-migration',
        eventAt: '2026-05-14',
        publishedAt: '2026-06-09',
        body: 'Проблема: legacy-плагины писали в БД через прямой SQL минуя ORM. Описываю карту аномалий.',
      },
    ],
    github: { commits: 42, prs: 6, repos: ['happybaby/migration'] },
  },
  {
    id: 't-url-preservation',
    slug: 'url-preservation',
    title: 'Сохранение исторических URL после миграции',
    problem: 'Нужно сохранить 18 лет SEO-истории при переносе на новый движок.',
    context:
      'Часть URL содержит ID из старой БД; часть — рукописные ЧПУ; часть — динамика по категориям.',
    status: 'active',
    projectId: 'p-happybaby',
    parentId: 't-modx-migration',
    relatedTasks: [],
    relatedTopics: [],
    worklogs: [
      {
        id: 'w1',
        taskId: 't-url-preservation',
        eventAt: '2026-05-30',
        publishedAt: '2026-06-08',
        body: 'Сформирована карта 12k URL → новые пути с 301 редиректами на уровне edge-роутера.',
      },
    ],
    result: 'Карта редиректов собрана; идёт фаза проверки на staging.',
    github: { commits: 8, prs: 2, repos: ['happybaby/migration'] },
  },
  {
    id: 't-agent-memory',
    slug: 'agent-memory',
    title: 'Долговременная память агента поверх knowledge graph',
    problem:
      'Агент должен переживать рестарт сессии и не забывать важный контекст пользователя.',
    context:
      'Эпизодическая память переполняется. Нужно правило вытеснения и связи с графом.',
    status: 'active',
    projectId: 'p-agent-engine',
    relatedTasks: [],
    relatedTopics: [],
    worklogs: [
      {
        id: 'w1',
        taskId: 't-agent-memory',
        eventAt: '2026-04-01',
        publishedAt: '2026-04-05',
        body: 'Прототип индексации эпизодов через k-NN по эмбеддингам.',
      },
      {
        id: 'w2',
        taskId: 't-agent-memory',
        eventAt: '2026-06-02',
        publishedAt: '2026-06-09',
        body: 'Замена k-NN на гибрид граф + векторный поиск даёт +27% точности на тестовом наборе.',
      },
    ],
    github: { commits: 67, prs: 9, repos: ['fi1osof/agent-engine'] },
  },
  {
    id: 't-graph-render',
    slug: 'graph-render',
    title: 'Собственная отрисовка графа знаний без сторонних либ',
    problem:
      'Готовые библиотеки тянут лишний вес и не позволяют гибко работать со связями.',
    context:
      'Нужна отрисовка ~2k узлов с приемлемой производительностью на ноутбуке.',
    status: 'done',
    projectId: 'p-knowledge-graph',
    relatedTasks: [],
    relatedTopics: [],
    worklogs: [
      {
        id: 'w1',
        taskId: 't-graph-render',
        eventAt: '2025-10-12',
        publishedAt: '2025-11-01',
        body: 'Сделана force-симуляция на canvas, ~60fps для 2k узлов.',
      },
    ],
    result: 'Своя реализация принята как базовая; от d3-force отказались.',
    github: { commits: 28, prs: 4, repos: ['fi1osof/kg-core'] },
  },
]
