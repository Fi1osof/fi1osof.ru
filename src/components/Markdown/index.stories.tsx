import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Markdown } from './index'

const meta = {
  title: 'Components/Markdown',
  component: Markdown,
  parameters: {
    // layout: 'centered',
  },
  args: {
    children: '',
  },
} satisfies Meta<typeof Markdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '# Hello World\n\nThis is a markdown field.',
  },
}

export const EmptyField: Story = {
  args: {
    children: null,
  },
}

export const WithFormattedText: Story = {
  args: {
    children: `# Форматированный текст

**Жирный текст**, *курсив* и ~~зачеркнутый текст~~.

## Списки

### Маркированный список:
- Пункт 1
- Пункт 2
  - Вложенный пункт
- Пункт 3

### Нумерованный список:
1. Первый пункт
2. Второй пункт
3. Третий пункт
`,
  },
}

export const WithLinks: Story = {
  args: {
    children: `# Ссылки

[Обычная ссылка](https://example.com)

[Ссылка с текстом при наведении](https://example.com "Пример подсказки")

## Специальные ссылки:

Телефон: [+7 (999) 123-45-67](tel:+79991234567)

Email: [example@example.com](mailto:example@example.com)

## Внутренние ссылки:

[Ссылка на другую страницу](/about)
`,
  },
}

export const WithCustomDirectives: Story = {
  args: {
    children: `# Пользовательские директивы

:::note
Это примечание с важной информацией
:::

:::warning
Предупреждение! Обратите внимание на это.
:::

:::info
Полезная информация для пользователя.
:::
`,
  },
}

export const WithReactComponents: Story = {
  args: {
    children: `# С React-компонентами
 
`,
  },
}

export const WithTable: Story = {
  args: {
    children: `# Таблицы

## Простая таблица

| Имя | Возраст | Город |
| --- | ------- | ----- |
| Анна | 25 | Москва |
| Иван | 30 | Санкт-Петербург |
| Мария | 27 | Казань |

## Таблица с выравниванием

| Левое | Центр | Правое |
| :--- | :---: | ---: |
| текст | текст | текст |
| длинный текст | короткий | 123 |
`,
  },
}

export const WithStrikethroughSubSup: Story = {
  args: {
    children: `# Зачёркивание и индексы

~~Зачёркнутый текст~~

Формула воды: H<sub>2</sub>O

E = mc<sup>2</sup>

Комбинация: ~~старый~~ **новый** текст с H<sub>2</sub>O
`,
  },
}

export const WithTaskList: Story = {
  args: {
    children: `# Список задач

- [x] Задача 1 выполнена
- [x] Задача 2 выполнена
- [ ] Задача 3 в процессе
- [ ] Задача 4 не начата

## Вложенные задачи

- [x] Основная задача
  - [x] Подзадача 1
  - [ ] Подзадача 2
- [ ] Другая задача
`,
  },
}

export const WithHorizontalRule: Story = {
  args: {
    children: `# Горизонтальные линии

Текст до линии

---

Текст после линии

***

Ещё один раздел
`,
  },
}

export const ComplexExample: Story = {
  args: {
    children: `# Комплексный пример

## Текст и форматирование

Это обычный текст с **жирным** и *курсивным* форматированием.

~~Зачёркнутый текст~~ и формула H<sub>2</sub>O с E = mc<sup>2</sup>

> Это цитата с [ссылкой](https://example.com)

---

## Таблица

| Имя | Возраст | Город |
| :--- | :---: | ---: |
| Анна | 25 | Москва |
| Иван | 30 | Санкт-Петербург |
| Мария | 27 | Казань |

## Код

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Изображение

![Пример изображения](https://via.placeholder.com/150)

## Список с задачами

- [x] Задача 1 выполнена
- [ ] Задача 2 в процессе
- [ ] Задача 3 не начата

---

\`\`\`env
LLAMA_MODEL=unsloth/Qwen3.5-4B-GGUF/Qwen3.5-4B-Q8_0.gguf
LLAMA_MMPROJ=unsloth/Qwen3.5-4B-GGUF/mmproj-F16.gguf
\`\`\`
`,
  },
}
