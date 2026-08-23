import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  imagePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  MDXEditorMethods,
  diffSourcePlugin,
  directivesPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  jsxPlugin,
  JsxComponentDescriptor,
  MDXEditorProps,
  RealmPlugin,
  tablePlugin,
  markdownShortcutPlugin,
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'

import { memo, useCallback, useMemo, useState } from 'react'
import { MarkdownEditorStyled } from './styles'
import { MarkdownEditorToolbar } from './Toolbar'
import { useSingleUploadMutation } from 'src/gql/generated'
import { useStopPropagationScroll } from 'src/hooks/useStopPropagationScroll'
import { FilesUploaderEditor } from './FilesUploaderEditor'
import { mathPlugin } from './mathPlugin'

type MarkdownEditorEditorProps = {
  value: string | null | undefined
  onChange: (value: string) => void
}

const MarkdownEditorComponent: React.FC<MarkdownEditorEditorProps> = ({
  value,
  onChange,
  ...other
}) => {
  const [editor, editorSetter] = useState<MDXEditorMethods | null>(null)
  const [uploadFile] = useSingleUploadMutation()

  const { containerRef } = useStopPropagationScroll()

  const imageUploadHandler = useCallback(
    async (file: File): Promise<string> => {
      const result = await uploadFile({
        variables: {
          data: {
            file,
          },
        },
      })

      if (result.data?.singleUpload?.path) {
        return `/images/resized/middle/${result.data.singleUpload.path}`
      }

      throw new Error('Upload failed')
    },
    [uploadFile],
  )

  const jsxComponentDescriptors = useMemo<JsxComponentDescriptor[]>(() => {
    return [
      {
        name: 'files-uploader',
        kind: 'flow',
        props: [],
        hasChildren: true,
        Editor: FilesUploaderEditor,
      },
      {
        name: 'file',
        kind: 'text',
        props: [{ name: 'data-id', type: 'string' }],
        hasChildren: true,
        Editor: () => null,
      },
    ]
  }, [])

  const plugins = useMemo(() => {
    const plugins: RealmPlugin[] = [
      directivesPlugin({
        directiveDescriptors: [],
        escapeUnknownTextDirectives: true,
      }),
      headingsPlugin(),
      listsPlugin(),
      thematicBreakPlugin(),
      imagePlugin({
        imageUploadHandler,
        imageAutocompleteSuggestions: [],
      }),
      jsxPlugin({ jsxComponentDescriptors }),

      quotePlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: 'text' }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          '': 'Plain Text',
          text: 'Plain Text',
          js: 'JavaScript',
          ts: 'TypeScript',
          tsx: 'TypeScript (React)',
          jsx: 'JavaScript (React)',
          css: 'CSS',
          html: 'HTML',
          json: 'JSON',
          bash: 'Bash',
          shell: 'Shell',
          sql: 'SQL',
          gql: 'GraphQL',
          python: 'Python',
          markdown: 'Markdown',
          django: 'Jinja/Django',
          env: 'Environment',
          yaml: 'YAML',
        },
      }),
      tablePlugin(),
      markdownShortcutPlugin(),
      mathPlugin(),
      diffSourcePlugin({ viewMode: 'rich-text' }),

      toolbarPlugin({
        toolbarContents: () => {
          return <MarkdownEditorToolbar editor={editor} />
        },
      }),
    ]

    return plugins
  }, [editor, imageUploadHandler, jsxComponentDescriptors])

  return (
    <MarkdownEditorStyled ref={containerRef} {...other}>
      <MDXEditor
        ref={editorSetter}
        contentEditableClassName="content"
        markdown={value ?? ''}
        onChange={onChange}
        onError={useCallback<NonNullable<MDXEditorProps['onError']>>((err) => {
          console.error('Parse error:', err)
          console.error('Parse error:', err.error)
        }, [])}
        plugins={plugins}
      />
    </MarkdownEditorStyled>
  )
}

export const MarkdownEditor = memo(MarkdownEditorComponent)

// For avoid storybook error
export default MarkdownEditor
