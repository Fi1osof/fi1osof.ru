import type { ActivityKind } from '../ui-kit/Status/ActivityIndicator/types'

export interface Project {
  id: string
  slug: string
  title: string
  description?: string
  intro?: string
  image?: string
  content?: string
  status: ActivityKind
  startedAt: string
  focus?: string[]
  history?: {
    id: string
    eventAt: string
    publishedAt: string
    label?: string
    text: string
  }[]
  relatedProjects?: string[]
  github?: { commits: number; prs: number; repos: string[] }
}

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`

export const projects: Project[] = [
  {
    id: 'p-agent-engine',
    slug: 'agent-engine',
    title: 'Agent Engine',
    description:
      'Движок для запуска и оркестрации автономных агентов с памятью, инструментами и графом знаний.',
    intro:
      'Платформа для автономных агентов: память, инструменты, оркестрация задач.',
    image: img('photo-1518770660439-4636190af475'),
    content: `## Зачем

Большинство «агентов» в индустрии — это обёртки вокруг одной LLM-сессии. Меня интересует другое: **автономный исполнитель**, который может неделями вести длинную задачу, помнить контекст и переключаться между инструментами.

## Что внутри

- **Цикл агента**: планирование → действие → наблюдение → рефлексия.
- **Память**: эпизодическая (текущая сессия) и долговременная (поверх knowledge graph).
- **Инструменты**: типизированный реестр, версионирование, песочница.

## Принципы

1. Агент — это **процесс**, а не chat-обёртка.
2. Память важнее модели. Контекст — это актив.
3. Инструменты должны быть **наблюдаемы**: каждое действие пишется в журнал.

> Цель — не заменить разработчика, а дать ему второго себя, работающего по ночам.`,
    status: 'active',
    startedAt: '2024-03',
    focus: ['Agents', 'Memory', 'Tools'],
    history: [
      {
        id: 'h1',
        eventAt: '2024-03-12',
        publishedAt: '2024-04-02',
        label: 'старт',
        text: 'Прототип CLI-агента на одной модели и одном инструменте.',
      },
      {
        id: 'h2',
        eventAt: '2024-09-04',
        publishedAt: '2024-11-10',
        text: 'Введена концепция эпизодической памяти и checkpointing-а сессии.',
      },
      {
        id: 'h3',
        eventAt: '2025-02-18',
        publishedAt: '2025-03-01',
        label: 'пивот',
        text: 'Отказ от монолитного executor в пользу графа задач.',
      },
      {
        id: 'h4',
        eventAt: '2026-05-22',
        publishedAt: '2026-06-09',
        text: 'Подключение собственного knowledge graph как long-term memory.',
      },
    ],
    relatedProjects: ['p-knowledge-graph', 'p-ai-frontend'],
    github: {
      commits: 312,
      prs: 47,
      repos: ['fi1osof/agent-engine', 'fi1osof/agent-tools'],
    },
  },
  {
    id: 'p-knowledge-graph',
    slug: 'knowledge-graph',
    title: 'Knowledge Graph',
    description:
      'Личный граф знаний: узлы — проекты, задачи, заметки; связи — причины, следствия, ссылки.',
    intro:
      'Граф знаний как личная операционная система: проекты, задачи и заметки связаны явно.',
    image: img('photo-1451187580459-43490279c0fa'),
    content: `## Идея

Знание — это **не текст**, а граф. Любая заметка должна быть **узлом** с явными связями: причина, следствие, контекст, ссылка на проект.

## Что уже работает

- Импорт исторических заметок 2008–2024.
- Базовая отрисовка графа (~2k узлов, 60 fps на canvas).
- Связь с Agent Engine как источник long-term memory.

## Что дальше

- CRDT-схема для синхронизации между устройствами.
- Полнотекстовый поиск с учётом связей, а не только содержимого.`,
    status: 'research',
    startedAt: '2025-01',
    focus: ['Graphs', 'Memory'],
    history: [
      {
        id: 'h1',
        eventAt: '2025-01-08',
        publishedAt: '2025-02-14',
        text: 'Эксперимент со схемой узлов на основе CRDT.',
      },
      {
        id: 'h2',
        eventAt: '2025-08-30',
        publishedAt: '2025-09-12',
        text: 'Импорт исторических заметок 2008–2024.',
      },
    ],
    relatedProjects: ['p-agent-engine'],
    github: { commits: 84, prs: 12, repos: ['fi1osof/kg-core'] },
  },
  {
    id: 'p-ai-frontend',
    slug: 'ai-frontend',
    title: 'AI Frontend',
    description:
      'Интерфейсный слой для работы с агентами: чат, дерево задач, ворклоги в реальном времени.',
    intro:
      'Рабочая среда для автономных агентов: чат, дерево задач, стриминг ворклогов.',
    image: img('photo-1517694712202-14dd9538aa97'),
    content: `## Зачем

У агента должен быть **интерфейс инженера**, а не «чат с ботом». Дерево задач, журнал действий, возможность вмешаться в любую точку.

## Из чего состоит

- Реактивное дерево задач.
- Стрим ворклогов и инструментов в реальном времени.
- Возможность откатить агента к произвольному чекпоинту.`,
    status: 'active',
    startedAt: '2025-06',
    focus: ['UI', 'React', 'Streaming'],
    history: [
      {
        id: 'h1',
        eventAt: '2025-06-02',
        publishedAt: '2025-07-15',
        text: 'Первый дизайн рабочей среды агента.',
      },
    ],
    relatedProjects: ['p-agent-engine'],
    github: { commits: 128, prs: 21, repos: ['fi1osof/ai-frontend'] },
  },
  {
    id: 'p-happybaby',
    slug: 'happybaby',
    title: 'HappyBaby Modernization',
    description:
      'Перенос исторической e-commerce системы с MODX Evolution на современный стек без потери истории.',
    intro:
      'Модернизация e-commerce 2008 года: миграция данных, сохранение SEO-истории, минимум потерь.',
    image: img('photo-1556745757-8d76bdb6984b'),
    content: `## Контекст

HappyBaby живёт с **2008 года**. За 18 лет накопилось:

- ~12k URL с SEO-историей.
- Кастомные таблицы без FK.
- Legacy-плагины, пишущие в БД минуя ORM.

## Задача

Перенести всё на современный стек **без потери данных и без потери SEO**.

## Подход

1. Аудит схемы и аномалий.
2. ETL: MODX → нормализованная модель → Postgres.
3. Карта 301-редиректов на уровне edge-роутера.`,
    status: 'paused',
    startedAt: '2008-04',
    focus: ['Legacy', 'MODX', 'Migration'],
    history: [
      {
        id: 'h1',
        eventAt: '2008-04-15',
        publishedAt: '2026-06-10',
        label: 'историческое событие',
        text: 'Запуск первой версии магазина на MODX Evolution.',
      },
      {
        id: 'h2',
        eventAt: '2024-11-04',
        publishedAt: '2025-01-20',
        text: 'Аудит легаси-кода и схемы БД, план поэтапной модернизации.',
      },
    ],
    relatedProjects: [],
    github: {
      commits: 1820,
      prs: 96,
      repos: ['happybaby/legacy', 'happybaby/migration'],
    },
  },
]
