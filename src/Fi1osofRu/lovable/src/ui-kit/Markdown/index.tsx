import type React from 'react'
import { useMemo } from 'react'
import { marked } from 'marked'
import { MarkdownStyled } from './styles'
import type { MarkdownProps } from './types'

marked.setOptions({ gfm: true, breaks: false })

export const Markdown: React.FC<MarkdownProps> = ({ source, ...other }) => {
  const html = useMemo(() => marked.parse(source) as string, [source])
  return (
    <MarkdownStyled {...other} dangerouslySetInnerHTML={{ __html: html }} />
  )
}
