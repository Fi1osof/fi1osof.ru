import React from 'react'
import { useTranslateButton } from 'src/Fi1osofRu/hooks/useTranslateButton'
import {
  BulkUpdateLangsEntityType,
  TaskWorkLogFragment,
} from 'src/gql/generated'

type WorkLogTranslateButtonProps = {
  workLog: TaskWorkLogFragment
}

export const WorkLogTranslateButton: React.FC<WorkLogTranslateButtonProps> = ({
  workLog,
}) => {
  const { translateButton } =
    useTranslateButton({
      entities: BulkUpdateLangsEntityType.TASKWORKLOG,
      id: workLog.id,
    }) || {}

  return translateButton
}
