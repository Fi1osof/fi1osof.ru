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
    children: `# Formatted Text

**Bold text**, *italic* and ~~strikethrough text~~.

## Lists

### Bulleted list:
- Item 1
- Item 2
  - Nested item
- Item 3

### Numbered list:
1. First item
2. Second item
3. Third item
`,
  },
}

export const WithLinks: Story = {
  args: {
    children: `# Links

[Regular link](https://example.com)

[Link with hover text](https://example.com "Example tooltip")

## Special links:

Phone: [+7 (999) 123-45-67](tel:+79991234567)

Email: [example@example.com](mailto:example@example.com)

## Internal links:

[Link to another page](/about)

<a href="#">Native HTML link</a>
`,
  },
}

export const WithCustomDirectives: Story = {
  args: {
    children: `# Custom Directives

:::note
This is a note with important information
:::

:::warning
Warning! Pay attention to this.
:::

:::info
Useful information for the user.
:::
`,
  },
}

export const WithReactComponents: Story = {
  args: {
    children: `# With React Components
 
`,
  },
}

export const WithTable: Story = {
  args: {
    children: `# Tables

## Simple table

| Name | Age | City |
| --- | ------- | ----- |
| Anna | 25 | Moscow |
| Ivan | 30 | Saint Petersburg |
| Maria | 27 | Kazan |

## Table with alignment

| Left | Center | Right |
| :--- | :---: | ---: |
| text | text | text |
| long text | short | 123 |
`,
  },
}

export const WithStrikethroughSubSup: Story = {
  args: {
    children: `# Strikethrough and Subscripts/Superscripts

~~Strikethrough text~~

Water formula: H<sub>2</sub>O

E = mc<sup>2</sup>

Combination: ~~old~~ **new** text with H<sub>2</sub>O
`,
  },
}

export const WithTaskList: Story = {
  args: {
    children: `# Task List

- [x] Task 1 completed
- [x] Task 2 completed
- [ ] Task 3 in progress
- [ ] Task 4 not started

## Nested tasks

- [x] Main task
  - [x] Subtask 1
  - [ ] Subtask 2
- [ ] Another task
`,
  },
}

export const WithHorizontalRule: Story = {
  args: {
    children: `# Horizontal Rules

Text before line

---

Text after line

***

Another section
`,
  },
}

export const ComplexExample: Story = {
  args: {
    children: `# Complex Example

## Text and formatting

This is regular text with **bold** and *italic* formatting.

~~Strikethrough text~~ and formula H<sub>2</sub>O with E = mc<sup>2</sup>

> This is a quote with [link](https://example.com)

---

## Table

| Name | Age | City |
| :--- | :---: | ---: |
| Anna | 25 | Moscow |
| Ivan | 30 | Saint Petersburg |
| Maria | 27 | Kazan |

## Code

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Image

![Example image](https://via.placeholder.com/150)

## Task list

- [x] Task 1 completed
- [ ] Task 2 in progress
- [ ] Task 3 not started

---

\`\`\`env
LLAMA_MODEL=unsloth/Qwen3.5-4B-GGUF/Qwen3.5-4B-Q8_0.gguf
LLAMA_MMPROJ=unsloth/Qwen3.5-4B-GGUF/mmproj-F16.gguf
\`\`\`
`,
  },
}

export const WithMermaid: Story = {
  args: {
    children: `# Mermaid Diagrams

## Flowchart

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Condition?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant S as Server
    participant DB as Database
    U->>S: Data request
    S->>DB: SQL query
    DB-->>S: Result
    S-->>U: JSON response
\`\`\`

## Regular code nearby

\`\`\`javascript
const data = await fetch('/api/data')
console.log(data)
\`\`\`
`,
  },
}
