import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ConceptEditForm as Component } from './'
import { UserStatusEnum } from 'src/gql/generated'

const meta = {
  title: 'components/Concept/Form',
  component: Component,
  args: {
    concept: undefined,
    cancelHandler: undefined,
    currentUser: undefined,
  },
} satisfies Meta<typeof Component>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

// TODO Add AppContext
export const WithUser: Story = {
  args: {
    currentUser: {
      id: 'non-sudo',
      sudo: false,
      createdAt: new Date('2026-09-19'),
      updatedAt: new Date('2026-09-19'),
      isAiAgent: false,
      status: UserStatusEnum.ACTIVE,
    },
  },
}

export const WithSudoUser: Story = {
  args: {
    currentUser: {
      id: 'sudo',
      sudo: true,
      createdAt: new Date('2026-09-19'),
      updatedAt: new Date('2026-09-19'),
      isAiAgent: false,
      status: UserStatusEnum.ACTIVE,
    },
  },
}
