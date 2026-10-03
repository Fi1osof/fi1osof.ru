import { useState, type ReactNode } from 'react'
import type { Decorator } from '@storybook/react'
import {
  ChatContext,
  ChatProvider,
  useChatContext,
} from 'src/components/Chat/ChatWidget/context'
import type { ChatMessage } from 'src/components/Chat/ChatWidget/interfaces'

export type ChatStoryState = {
  messages?: ChatMessage[]
  isLoading?: boolean
  showTypingIndicator?: boolean
  isOpen?: boolean
  isExpanded?: boolean
  initialMessage?: string
}

const ChatStateWrapper = ({
  children,
  state,
}: {
  children: ReactNode
  state: ChatStoryState
}) => {
  const chat = useChatContext()
  const [isOpen, setIsOpen] = useState(state.isOpen ?? false)
  const [isExpanded, setIsExpanded] = useState(state.isExpanded ?? false)
  const [isLoading, setIsLoading] = useState(state.isLoading ?? false)
  const [initialMessage, initialMessageSetter] = useState(
    state.initialMessage ?? '',
  )

  return (
    <ChatContext.Provider
      value={{
        ...chat,
        messages: [...(state.messages ?? []), ...chat.messages],
        isOpen,
        isExpanded,
        isLoading: isLoading || chat.isLoading,
        showTypingIndicator:
          (isLoading && !!state.showTypingIndicator) ||
          chat.showTypingIndicator,
        initialMessage,
        initialMessageSetter,
        setIsOpen,
        setIsExpanded,
        handleClose: () => {
          setIsOpen(false)
          setIsExpanded(false)
        },
        handleExpand: () => setIsExpanded((expanded) => !expanded),
        handleToggle: (event) => {
          event.preventDefault()
          event.stopPropagation()
          setIsOpen((open) => !open)
        },
        submitMessage: (text) => {
          setIsExpanded(true)
          return chat.submitMessage(text)
        },
        stopStreaming: () => {
          setIsLoading(false)
          chat.stopStreaming()
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const withChatContext: Decorator = (Story, context) => (
  <ChatProvider key={context.id}>
    <ChatStateWrapper state={context.parameters.chatContext ?? {}}>
      <Story />
    </ChatStateWrapper>
  </ChatProvider>
)
