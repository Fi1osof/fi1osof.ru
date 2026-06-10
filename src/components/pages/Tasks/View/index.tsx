import React from 'react'
import { TaskFragment } from 'src/gql/generated'
import { TaskCard } from 'src/components/TaskCard'
import { TaskStatusFilter } from 'src/components/TaskStatusFilter'
import { TasksViewStyled, TasksViewGridStyled } from './styles'
import { Pagination } from 'src/components/Pagination'

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
  return (
    <TasksViewStyled>
      <h1>Tasks</h1>

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
