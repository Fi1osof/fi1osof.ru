import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import { LlmModel } from 'src/gql/generated'
import { Select, SelectOption } from 'src/ui-kit/controls/Select'
import { Checkbox } from 'src/ui-kit/controls/Checkbox'
import { isModel } from '../helpers/isModel'
import { ModelSelectStyled } from './styles'

const modelOptions: SelectOption[] = Object.values(LlmModel).map((value) => ({
  value,
  label: value,
}))

type ModelSelectProps = {
  models: LlmModel[]
  modelsSetter: Dispatch<SetStateAction<LlmModel[]>>
  multiple: boolean
  multipleSetter: Dispatch<SetStateAction<boolean>>
}

export const ModelSelect: React.FC<ModelSelectProps> = ({
  models,
  modelsSetter,
  multiple,
  multipleSetter,
}) => {
  const onChangeSingle = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.currentTarget.value

      if (isModel(value)) {
        modelsSetter([value])
      }
    },
    [modelsSetter],
  )

  const onToggleMultiple = useCallback(() => {
    multipleSetter((prev) => !prev)
  }, [multipleSetter])

  const onChangeCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value
      const checked = event.currentTarget.checked

      if (isModel(value)) {
        modelsSetter((prev) =>
          checked ? [...prev, value] : prev.filter((m) => m !== value),
        )
      }
    },
    [modelsSetter],
  )

  const checkboxes = useMemo(() => {
    return Object.values(LlmModel).map((m) => (
      <Checkbox
        key={m}
        label={m}
        value={m}
        checked={models.includes(m)}
        onChange={onChangeCheckbox}
      />
    ))
  }, [models, onChangeCheckbox])

  return (
    <ModelSelectStyled>
      <div>
        {multiple ? (
          <div>{checkboxes}</div>
        ) : (
          <Select
            value={models[0]}
            onChange={onChangeSingle}
            options={modelOptions}
          />
        )}
      </div>
      <Checkbox
        label="Multiple"
        checked={multiple}
        onChange={onToggleMultiple}
        style={{
          whiteSpace: 'nowrap',
        }}
      />
    </ModelSelectStyled>
  )
}
