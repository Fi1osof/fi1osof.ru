import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UserLink } from './index'
import { UserStatusEnum } from 'src/gql/generated'

const meta = {
  title: 'Components/Link/UserLink',
  component: UserLink,
  tags: ['autodocs'],
} satisfies Meta<typeof UserLink>

export default meta
type Story = StoryObj<typeof UserLink>

export const Default: Story = {
  args: {
    user: {
      id: 'user-1',
      fullname: 'John Doe',
      username: 'john',
      createdAt: new Date('2026-04-08T17:55:58.261Z'),
      updatedAt: new Date('2026-04-08T17:55:58.261Z'),
      status: UserStatusEnum.NEWBIE,
    },
  },
}

export const WithoutId: Story = {
  args: {
    user: {
      id: 'user-2',
      fullname: 'Unnamed (no id)',
      username: 'no-id-user',
      createdAt: new Date('2026-04-08T17:55:58.261Z'),
      updatedAt: new Date('2026-04-08T17:55:58.261Z'),
      status: UserStatusEnum.ACTIVE,
    },
  },
}
