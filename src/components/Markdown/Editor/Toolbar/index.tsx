import {
  InsertImage,
  UndoRedo,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles,
  // CodeToggle,
  CreateLink,
  InsertCodeBlock,
  InsertThematicBreak,
  InsertTable,
  ListsToggle,
  BlockTypeSelect,
  Separator,
  DiffSourceToggleWrapper,
  MDXEditorMethods,
} from '@mdxeditor/editor'
import { memo } from 'react'
import { MarkdownEditorToolbarStyled } from './styles'
import { InsertGeneratedImage } from './InsertGeneratedImage'

type MarkdownEditorToolbarProps = {
  editor: MDXEditorMethods | null
}

const MarkdownEditorToolbarComponent: React.FC<
  MarkdownEditorToolbarProps
> = () => {
  return (
    <MarkdownEditorToolbarStyled>
      {/* Basic actions */}
      <UndoRedo />

      {/* Text formatting */}
      <BoldItalicUnderlineToggles />
      <StrikeThroughSupSubToggles />
      {/* <CodeToggle /> */}

      {/* Structural elements */}
      <BlockTypeSelect />
      <ListsToggle />

      {/* Insert objects */}
      <InsertCodeBlock />
      <InsertThematicBreak />
      <InsertTable />
      <CreateLink />
      <InsertImage />
      <InsertGeneratedImage />

      <Separator />

      {/* View mode toggle */}
      <DiffSourceToggleWrapper>{null}</DiffSourceToggleWrapper>
    </MarkdownEditorToolbarStyled>
  )
}

export const MarkdownEditorToolbar = memo(MarkdownEditorToolbarComponent)
