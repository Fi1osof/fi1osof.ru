import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Popover as Component } from './index'
import { useBoolean } from 'src/hooks/useBoolean'
import { Button } from '../Button'

const Renderer: React.FC = () => {
  const [opened, openedOn, openedOff] = useBoolean()

  return (
    <Component
      item={<div style={{ padding: '8px' }}>Popover content here</div>}
      opened={opened}
      onCloseHandler={openedOff}
    >
      <Button onClick={openedOn}>Click me</Button>
    </Component>
  )
}

const meta = {
  title: 'UI Kit/Popover',
  component: Renderer,
} satisfies Meta<typeof Renderer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
