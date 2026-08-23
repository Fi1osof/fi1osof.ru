import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from 'src/theme'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

import { Markdown } from './'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('Markdown component mechanics', () => {
  describe('LaTeX rendering', () => {
    it('renders inline math with $ delimiters', () => {
      const content = 'The formula is $E = mc^2$ in physics.'

      const { container } = renderWithTheme(<Markdown>{content}</Markdown>)

      const katexSpan = container.querySelector('.katex')
      expect(katexSpan).toBeTruthy()
    })

    it('renders block math with $$ delimiters', () => {
      const content = `Block formula:

$$
x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$`

      const { container } = renderWithTheme(<Markdown>{content}</Markdown>)

      const katexDisplay = container.querySelector('.katex-display')
      expect(katexDisplay).toBeTruthy()
    })

    it('renders multiple inline math expressions', () => {
      const content = 'First $a^2$ and second $b^2$ formulas.'

      const { container } = renderWithTheme(<Markdown>{content}</Markdown>)

      const katexSpans = container.querySelectorAll('.katex')
      expect(katexSpans.length).toBe(2)
    })

    it('renders mixed inline and block math', () => {
      const content = `Inline $E = mc^2$ and block:

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$`

      const { container } = renderWithTheme(<Markdown>{content}</Markdown>)

      const inlineKatex = container.querySelectorAll(
        '.katex:not(.katex-display .katex)',
      )
      const blockKatex = container.querySelector('.katex-display')
      expect(inlineKatex.length).toBeGreaterThanOrEqual(1)
      expect(blockKatex).toBeTruthy()
    })
  })

  describe('HTML tags with attributes', () => {
    it('renders span with data attributes', () => {
      const content = '<span data-id="123" data-type="button">some text</span>'

      const { container } = renderWithTheme(<Markdown>{content}</Markdown>)

      const span = container.querySelector('span[data-id="123"]')
      expect(span).toBeTruthy()
      expect(span?.getAttribute('data-type')).toBe('button')
      expect(span?.textContent).toBe('some text')
    })

    it('renders multiple elements with attributes', () => {
      const content =
        'Text <span data-id="1">first</span> and <span data-id="2">second</span>'

      const { container } = renderWithTheme(<Markdown>{content}</Markdown>)

      expect(container.querySelector('[data-id="1"]')).toBeTruthy()
      expect(container.querySelector('[data-id="2"]')).toBeTruthy()
    })

    it('preserves class attribute', () => {
      const content = '<span class="highlight">element</span>'

      const { container } = renderWithTheme(<Markdown>{content}</Markdown>)

      const span = container.querySelector('span.highlight')
      expect(span).toBeTruthy()
    })
  })
})
