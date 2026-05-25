import TurndownService from 'turndown'
import { builder } from 'server/schema/builder'
import { load } from 'cheerio'

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const DEFAULT_TIMEOUT = 30000

const OutputFormatEnum = builder.enumType('OutputFormat', {
  values: ['markdown', 'html', 'text'] as const,
})

function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: 'URL is required' }
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return { valid: false, error: 'URL must start with http:// or https://' }
  }
  try {
    const parsed = new URL(url)
    if (!parsed.hostname) {
      return { valid: false, error: 'URL must contain a valid hostname' }
    }
    return { valid: true }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

interface ReadWebPageResult {
  url: string
  finalUrl: string
  statusCode: number
  title: string
  description: string
  content: string
  contentLength: number
  error: string | null
}

builder.mutationField('readWebPage', (t) =>
  t.field({
    type: 'Json',
    args: {
      url: t.arg.string({ required: true }),
      selector: t.arg.string({
        description: 'CSS selector to extract specific part',
      }),
      maxLength: t.arg.int({ description: 'Max content length in characters' }),
      timeout: t.arg.int({
        description: 'Request timeout in ms (default 30000)',
      }),
      userAgent: t.arg.string({ description: 'Custom User-Agent header' }),
      outputFormat: t.arg({
        type: OutputFormatEnum,
        description: 'Output format: markdown (default), html, or text',
        required: true,
        defaultValue: 'markdown',
      }),
    },
    async resolve(
      _,
      { url, selector, maxLength, timeout, userAgent, outputFormat },
    ): Promise<ReadWebPageResult> {
      const validation = validateUrl(url)
      if (!validation.valid) {
        return {
          url,
          finalUrl: url,
          statusCode: 0,
          title: '',
          description: '',
          content: '',
          contentLength: 0,
          error: validation.error || 'Invalid URL',
        }
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(
        () => controller.abort(),
        timeout || DEFAULT_TIMEOUT,
      )

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': userAgent || DEFAULT_USER_AGENT,
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          redirect: 'follow',
        })

        clearTimeout(timeoutId)

        const contentType = response.headers.get('content-type') || ''
        if (
          !contentType.includes('text/html') &&
          !contentType.includes('application/xhtml')
        ) {
          return {
            url,
            finalUrl: response.url,
            statusCode: response.status,
            title: '',
            description: '',
            content: '',
            contentLength: 0,
            error: `Unsupported content type: ${contentType}`,
          }
        }

        const html = await response.text()
        const $ = load(html)

        // Remove scripts, styles, nav, footer, etc.
        $(
          'script, style, nav, footer, header, aside, iframe, noscript, svg',
        ).remove()

        const title = $('title').text().trim()
        const description =
          $('meta[name="description"]').attr('content') ||
          $('meta[property="og:description"]').attr('content') ||
          ''

        const targetHtml = selector ? $(selector).html() : $('body').html()

        let content: string

        switch (outputFormat) {
          case 'html':
            content = targetHtml || ''

            break

          case 'text':
            content = selector
              ? $(selector).text().trim()
              : $('body').text().trim()

            break

          default:
            content = turndown.turndown(targetHtml || '')
        }

        const fullLength = content.length
        if (maxLength && content.length > maxLength) {
          content = content.slice(0, maxLength) + '...'
        }

        return {
          url,
          finalUrl: response.url,
          statusCode: response.status,
          title,
          description,
          content,
          contentLength: fullLength,
          error: null,
        }
      } catch (e) {
        clearTimeout(timeoutId)

        let errorMessage = 'Unknown error'
        if (e instanceof Error) {
          if (e.name === 'AbortError') {
            errorMessage = `Request timeout after ${timeout || DEFAULT_TIMEOUT}ms`
          } else {
            errorMessage = e.message
          }
        }

        return {
          url,
          finalUrl: url,
          statusCode: 0,
          title: '',
          description: '',
          content: '',
          contentLength: 0,
          error: errorMessage,
        }
      }
    },
  }),
)
