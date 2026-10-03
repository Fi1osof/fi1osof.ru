import { RequestType, type RestMockConfig } from '../addons/msw/msw-adapter'
import type { ChatMessage } from 'src/components/Chat/ChatWidget/interfaces'

const markdownContrastExample = [
  '## Markdown contrast check',
  '',
  'Regular text, **bold**, *italic*, ~~strikethrough~~ and `inline code`.',
  '',
  '[External link](https://example.com), [internal link](/) and [email](mailto:hello@example.com).',
  '',
  '> A blockquote with **emphasis**, a [link](https://example.com) and `inline code`.',
  '>',
  '> Another paragraph to check the quote background and border.',
  '',
  '### Code with syntax highlighting',
  '',
  '```typescript',
  '// Comments, keywords, strings and numbers should all remain readable.',
  'const greeting: string = "Hello, world!"',
  'const count = 42',
  'function greet(name: string) {',
  '  return `${greeting} ${name}: ${count}`',
  '}',
  '```',
  '',
  '```',
  'Plain code block without syntax highlighting.',
  'Check its text, background and border.',
  '```',
  '',
  '### Lists and checkboxes',
  '',
  '- Bullet with **bold text**',
  '- Bullet with `inline code`',
  '  - Nested item with a [link](https://example.com)',
  '',
  '1. First numbered item',
  '2. Second numbered item',
  '',
  '- [x] Completed task',
  '- [ ] Pending task',
  '',
  '### Table',
  '',
  '| Element | Sample |',
  '| --- | --- |',
  '| Link | [Example](https://example.com) |',
  '| Code | `const value = 42` |',
  '| Emphasis | **Bold** and *italic* |',
  '',
  '---',
  '',
  '<mark>Highlighted text</mark>, <kbd>Ctrl</kbd> + <kbd>Enter</kbd>, <small>small text</small>, H<sub>2</sub>O and x<sup>2</sup>.',
  '',
  'Inline math: $E = mc^2$.',
  '',
  '$$',
  'a^2 + b^2 = c^2',
  '$$',
].join('\n')

export const mockChatMessages: ChatMessage[] = [
  { id: 'user-1', isUser: true, text: 'Hello! How can I learn React?' },
  {
    id: 'bot-1',
    isUser: false,
    text: `Great question! Here are some steps to learn React:

1. **Learn JavaScript basics** - ES6+ features
2. **Understand JSX** - React's syntax extension
3. **Components and Props** - Building blocks
4. **State and Hooks** - Managing data`,
  },
  { id: 'user-2', isUser: true, text: 'What about hooks?' },
  {
    id: 'bot-2',
    isUser: false,
    text: 'Hooks are functions that let you use state and other React features. The most common ones are `useState` and `useEffect`.',
  },
  { id: 'user-3', isUser: true, text: markdownContrastExample },
  { id: 'bot-3', isUser: false, text: markdownContrastExample },
]

export const mockStreamingMessages: ChatMessage[] = [
  { id: 'user-1', isUser: true, text: 'How do I learn React?' },
  {
    id: 'bot-1',
    isUser: false,
    text: 'Great question! Here are some steps to learn React...',
  },
]

// The stream client also accepts a final JSON item without a trailing newline.
export const mockChatResponse: RestMockConfig = {
  type: RequestType.REST,
  method: 'post',
  url: '/webhook/agent-chat-webhook/chat',
  response: {
    type: 'item',
    content: 'This is a mocked assistant response. How else can I help?',
  },
}
