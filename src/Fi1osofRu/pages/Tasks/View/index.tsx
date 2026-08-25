import React from 'react'
import { TaskFragment, UserStatusEnum } from 'src/gql/generated'
import { TaskStatusFilter } from 'src/components/TaskStatusFilter'
import { TasksViewStyled, TasksViewGridStyled } from './styles'
import { Pagination } from 'src/components/Pagination'
import { Flex1, Toolbar } from 'src/styles'
import { useAppContext } from 'src/components/AppContext'
import Link from 'next/link'
import { Button } from 'src/ui-kit/Button'
import { useLexicon } from 'src/Fi1osofRu/Lexicon'
import { tasksViewLexicon } from './lexicon'
import { TaskCardFi1osofRu } from 'src/Fi1osofRu/components/TaskCard'

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
  const { t } = useLexicon(tasksViewLexicon)

  return (
    <TasksViewStyled>
      <Toolbar>
        <h1>{t('title')}</h1>
        <Flex1 />

        {currentUser?.status === UserStatusEnum.ACTIVE && (
          <Link href={'/tasks/create'}>
            <Button>{t('create')}</Button>
          </Link>
        )}
      </Toolbar>

      <TaskStatusFilter />

      <TasksViewGridStyled>
        {tasks.map((task) => (
          <TaskCardFi1osofRu key={task.id} task={task} variant="list" />
        ))}
      </TasksViewGridStyled>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </TasksViewStyled>
  )
}
