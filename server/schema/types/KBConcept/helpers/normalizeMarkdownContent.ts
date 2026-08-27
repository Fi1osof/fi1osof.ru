import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { mdxJsxFromMarkdown, mdxJsxToMarkdown } from 'mdast-util-mdx-jsx'
import { mdxjs } from 'micromark-extension-mdxjs'
import { validateSelfClosingTags } from 'src/components/Markdown/helpers/validateSelfClosingTags'

/**
 * Normalizes markdown content using the same approach as @mdxeditor/editor:
 * parse to AST and serialize back with consistent formatting.
 *
 * This applies:
 * - Consistent indentation
 * - Removes extra blank lines
 * - Proper JSX tag formatting
 */
export async function normalizeMarkdownContent(
  content: string,
): Promise<string> {
  validateSelfClosingTags(content)

  const tree = fromMarkdown(content, {
    extensions: [mdxjs()],
    mdastExtensions: [mdxJsxFromMarkdown()],
  })

  const result = toMarkdown(tree, {
    extensions: [mdxJsxToMarkdown()],
    listItemIndent: 'one',
  })

  return result
}
