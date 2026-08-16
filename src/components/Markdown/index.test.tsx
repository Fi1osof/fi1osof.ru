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
