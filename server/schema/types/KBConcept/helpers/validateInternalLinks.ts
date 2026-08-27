import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { visit } from 'unist-util-visit'
import type { Link, Text } from 'mdast'
import type { Node } from 'unist'
import type { MdxJsxTextElement, MdxJsxFlowElement } from 'mdast-util-mdx-jsx'

interface Replacement {
  start: number
  end: number
  text: string
}

interface AttributeReplacement {
  start: number
  end: number
  newValue?: string
}

export interface ConceptLink {
  uri: string
}

export interface InvalidLink {
  url: string
  tagName?: string
  position?: {
    start: { line: number; column: number }
    end: { line: number; column: number }
  }
}

export interface ValidateInternalLinksResult {
  invalidLinks: InvalidLink[]
}

function isInternalLink(url: string): boolean {
  return url.startsWith('/')
}

function findReplacementUrl(
  url: string,
  urlReplacements: Map<string, string> | undefined,
  validUris: Set<string>,
): string | undefined {
  if (!urlReplacements) {
    return undefined
  }

  for (const [from, to] of urlReplacements) {
    if (url.startsWith(from)) {
      const newUrl = url.replace(from, to)
      if (validUris.has(newUrl)) {
        return newUrl
      }
    }
  }

  return undefined
}

function extractTextFromChildren(children: Node[]): string {
  let text = ''
  for (const child of children) {
    if (child.type === 'text') {
      text += (child as Text).value
    } else if ('children' in child && Array.isArray(child.children)) {
      text += extractTextFromChildren(child.children as Node[])
    }
  }
  return text
}

export interface RemoveInvalidLinksResult {
  content: string
  invalidLinks: InvalidLink[]
}

export async function removeInvalidLinks(
  content: string,
  validUris: Set<string>,
  update: boolean,
): Promise<RemoveInvalidLinksResult> {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(content)

  const replacements: Replacement[] = []
  const attributeReplacements: AttributeReplacement[] = []
  const invalidLinks: InvalidLink[] = []

  const urlReplacements = new Map<string, string>([['/provinces', '/province']])

  visit(tree, 'link', (node: Link) => {
    const url = node.url

    if (isInternalLink(url) && !validUris.has(url)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Invalid url', url)
      }

      invalidLinks.push({
        url,
        tagName: 'link',
        position: node.position
          ? {
              start: {
                line: node.position.start.line,
                column: node.position.start.column,
              },
              end: {
                line: node.position.end.line,
                column: node.position.end.column,
              },
            }
          : undefined,
      })

      if (update && node.position) {
        if (
          node.position.start.offset !== undefined &&
          node.position.end.offset !== undefined
        ) {
          // Проверяем есть ли замена для URL
          const replacementUrl = urlReplacements?.get(url)
          const finalUrl =
            replacementUrl ??
            findReplacementUrl(url, urlReplacements, validUris)

          if (finalUrl) {
            // Заменяем URL в ссылке
            const textValue = node.children
              .filter((child): child is Text => child.type === 'text')
              .map((child) => child.value)
              .join('')

            replacements.push({
              start: node.position.start.offset,
              end: node.position.end.offset,
              text: `[${textValue}](${finalUrl})`,
            })
          } else {
            // Удаляем ссылку, оставляем текст
            const textValue = node.children
              .filter((child): child is Text => child.type === 'text')
              .map((child) => child.value)
              .join('')

            replacements.push({
              start: node.position.start.offset,
              end: node.position.end.offset,
              text: textValue,
            })
          }
        }
      }
    }
  })

  visit(tree, (node) => {
    if (
      node.type !== 'mdxJsxTextElement' &&
      node.type !== 'mdxJsxFlowElement'
    ) {
      return
    }

    const jsxNode = node as MdxJsxTextElement | MdxJsxFlowElement

    // Проверяем href для тега <a>
    if (jsxNode.name === 'a') {
      const hrefAttr = jsxNode.attributes.find(
        (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'href',
      )
      const url =
        hrefAttr && hrefAttr.type === 'mdxJsxAttribute'
          ? String(hrefAttr.value)
          : ''

      if (isInternalLink(url) && !validUris.has(url)) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Invalid url (jsx)', url)
        }

        invalidLinks.push({
          url,
          tagName: 'a',
          position: jsxNode.position
            ? {
                start: {
                  line: jsxNode.position.start.line,
                  column: jsxNode.position.start.column,
                },
                end: {
                  line: jsxNode.position.end.line,
                  column: jsxNode.position.end.column,
                },
              }
            : undefined,
        })

        if (update && jsxNode.position) {
          if (
            jsxNode.position.start.offset !== undefined &&
            jsxNode.position.end.offset !== undefined
          ) {
            // Проверяем есть ли замена для URL
            const replacementUrl = urlReplacements?.get(url)
            const finalUrl =
              replacementUrl ??
              findReplacementUrl(url, urlReplacements, validUris)

            if (finalUrl) {
              // Заменяем URL в ссылке
              const textValue = extractTextFromChildren(
                jsxNode.children as Node[],
              )

              replacements.push({
                start: jsxNode.position.start.offset,
                end: jsxNode.position.end.offset,
                text: `[${textValue}](${finalUrl})`,
              })
            } else {
              // Удаляем ссылку, оставляем текст
              const textValue = extractTextFromChildren(
                jsxNode.children as Node[],
              )

              replacements.push({
                start: jsxNode.position.start.offset,
                end: jsxNode.position.end.offset,
                text: textValue,
              })
            }
          }
        }
      }
    }

    // Проверяем data-href для любых тегов
    const dataHrefAttr = jsxNode.attributes.find(
      (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'data-href',
    )

    if (dataHrefAttr && dataHrefAttr.type === 'mdxJsxAttribute') {
      const url = String(dataHrefAttr.value)

      if (isInternalLink(url) && !validUris.has(url)) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Invalid url (data-href)', url)
        }

        invalidLinks.push({
          url,
          tagName: jsxNode.name || 'unknown',
          position: jsxNode.position
            ? {
                start: {
                  line: jsxNode.position.start.line,
                  column: jsxNode.position.start.column,
                },
                end: {
                  line: jsxNode.position.end.line,
                  column: jsxNode.position.end.column,
                },
              }
            : undefined,
        })

        if (
          update &&
          dataHrefAttr.position &&
          dataHrefAttr.position.start.offset !== undefined &&
          dataHrefAttr.position.end.offset !== undefined
        ) {
          // Проверяем есть ли замена для URL
          const replacementUrl = urlReplacements?.get(url)
          const finalUrl =
            replacementUrl ??
            findReplacementUrl(url, urlReplacements, validUris)

          if (finalUrl) {
            // Заменяем значение атрибута
            attributeReplacements.push({
              start: dataHrefAttr.position.start.offset,
              end: dataHrefAttr.position.end.offset,
              newValue: `data-href="${finalUrl}"`,
            })
          } else {
            // Удаляем атрибут
            attributeReplacements.push({
              start: dataHrefAttr.position.start.offset,
              end: dataHrefAttr.position.end.offset,
            })
          }
        }
      }
    }
  })

  if (!update) {
    return { content, invalidLinks }
  }

  // Объединяем все замены и сортируем по убыванию позиции
  const allReplacements: Array<{ start: number; end: number; text: string }> = [
    ...replacements,
    ...attributeReplacements.map((r) => ({ ...r, text: r.newValue ?? '' })),
  ]
  allReplacements.sort((a, b) => b.start - a.start)

  let result = content

  for (const { start, end, text } of allReplacements) {
    result = result.slice(0, start) + text + result.slice(end)
  }

  return { content: result, invalidLinks }
}
