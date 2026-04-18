import React from 'react'
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
import { MarkdownStyled } from './styles'

/**
 * Начиная с 9 версии ремарк стал обнулять тел и мейлто ссылки.
 * https://github.com/remarkjs/react-markdown/issues/829
 */
const urlTransform: UrlTransform = (url, _name, _node) => {
  const fixed = defaultUrlTransform(url)

  // если схема tel/mailto — пропускаем как есть
  if (url.startsWith('tel:') || url.startsWith('mailto:')) {
    return url
  }
  return fixed
}

const components: Components = {
  a: ({ node: _node, href: hrefProps, ...props }) => {
    const href: string | undefined = hrefProps

    return (
      <>
        {href ? (
          <Link
            href={href}
            {...props}
            target={href && /^https?:/.test(href) ? '_blank' : undefined}
          />
        ) : (
          <span {...props} />
        )}
      </>
    )
  },
  img: ({ node: _node, src, alt, ...props }) => {
    if (!src) {
      return null
    }

    return <Image src={src} alt={alt ?? ''} {...props} />
  },
}

// const allowElement: AllowElement = (element, index, parent) => {
//   return element.tagName !== 'img'
// }

type MarkdownProps = {
  children: string | null | undefined
  className?: string
}

export const Markdown: React.FC<MarkdownProps> = ({ children, ...other }) => {
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
