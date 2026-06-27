import React, { useMemo, useRef } from 'react'
import Link from 'next/link'
import ReactMarkdown, {
  // AllowElement,
  Components,
  defaultUrlTransform,
  UrlTransform,
} from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypePrism from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'

import { Image } from 'src/components/Image'
import { Mermaid } from 'src/components/Mermaid'
import { MarkdownStyled } from './styles'

/**
 * Since version 9, remark has been nullifying tel and mailto links.
 * https://github.com/remarkjs/react-markdown/issues/829
 */
const urlTransform: UrlTransform = (url, _name, _node) => {
  const fixed = defaultUrlTransform(url)

  // if scheme is tel/mailto — pass as is
  if (url.startsWith('tel:') || url.startsWith('mailto:')) {
    return url
  }
  return fixed
}

const createComponents = ({
  getContent,
}: {
  getContent: () => string | null | undefined
}): Components => ({
  a: ({ node: _node, href: hrefProps, ...props }) => {
    const href: string | undefined = hrefProps

    if (!href) {
      return <span {...props} />
    }

    const external = /^https?:/.test(href)

    const Component = external ? 'a' : Link

    return (
      <>
        <Component
          href={href}
          {...props}
          target={external ? '_blank' : undefined}
        />
      </>
    )
  },
  img: ({ node: _node, src, alt, ...props }) => {
    if (!src) {
      return null
    }

    return <Image src={String(src)} alt={alt ?? ''} {...props} />
  },
  pre: ({ node, children, ...props }) => {
    const codeElement = node?.children?.[0]
    if (
      codeElement?.type === 'element' &&
      codeElement.tagName === 'code' &&
      codeElement.properties?.className
    ) {
      const classNames = codeElement.properties.className as string[]
      const isMermaid = classNames?.some((c) => c === 'language-mermaid')

      if (isMermaid) {
        const content = getContent()
        const { start, end } = node?.position || {}

        if (
          content &&
          start?.offset !== undefined &&
          end?.offset !== undefined
        ) {
          const extracted = content.substring(start.offset, end.offset)
          const match = extracted
            .trim()
            .match(/^```mermaid\n?([\s\S]*?)\n?```$/)
          const source = match?.[1]?.trim() || ''

          if (source) {
            return <Mermaid source={source} />
          }
        }
      }
    }

    return <pre {...props}>{children}</pre>
  },
})

// const allowElement: AllowElement = (element, index, parent) => {
//   return element.tagName !== 'img'
// }

type MarkdownProps = {
  children: string | null | undefined
  className?: string
}

export const Markdown: React.FC<MarkdownProps> = ({ children, ...other }) => {
  const childrenRef = useRef(children)
  childrenRef.current = children

  const components = useMemo(
    () => createComponents({ getContent: () => childrenRef.current }),
    [],
  )

  return children ? (
    <MarkdownStyled {...other}>
      <ReactMarkdown
        urlTransform={urlTransform}
        remarkPlugins={[remarkGfm]}
        components={components}
        // allowElement={allowElement}
        rehypePlugins={[rehypeRaw, [rehypePrism, { ignoreMissing: true }]]}
      >
        {children}
      </ReactMarkdown>
    </MarkdownStyled>
  ) : null
}
