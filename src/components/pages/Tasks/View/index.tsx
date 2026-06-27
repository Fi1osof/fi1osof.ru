import React from 'react'
import { TaskFragment, UserStatusEnum } from 'src/gql/generated'
import { TaskCard } from 'src/components/TaskCard'
import { TaskStatusFilter } from 'src/components/TaskStatusFilter'
import { TasksViewStyled, TasksViewGridStyled } from './styles'
import { Pagination } from 'src/components/Pagination'
import { Flex1, Toolbar } from 'src/styles'
import { useAppContext } from 'src/components/AppContext'
import Link from 'next/link'
import { Button } from 'src/ui-kit/Button'

type TasksViewProps = {
  tasks: TaskFragment[]
  loading?: boolean
  currentPage: number
  totalPages: number
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  currentPage,
  totalPages,
}) => {
  const { user: currentUser } = useAppContext()

  return (
    <TasksViewStyled>
      <Toolbar>
        <h1>Tasks</h1>
        <Flex1 />

        {currentUser?.status === UserStatusEnum.ACTIVE && (
          <Link href={'/tasks/create'}>
            <Button>Create</Button>
          </Link>
        )}
      </Toolbar>

      <TaskStatusFilter />

      <TasksViewGridStyled>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </TasksViewGridStyled>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </TasksViewStyled>
  )
}
