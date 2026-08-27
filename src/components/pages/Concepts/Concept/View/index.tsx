import {
  BulkUpdateLangsEntityType,
  KbConceptFragment,
  MeUserFragment,
} from 'src/gql/generated'
import { ConceptItem } from '../../View/ConceptItem'
import { useBoolean } from 'src/hooks/useBoolean'
import { ConceptEditForm } from '../Form'
import { Button } from 'src/ui-kit/Button'
import { ConceptViewStyled } from './styles'
import { useTranslateButton } from 'src/Fi1osofRu/hooks/useTranslateButton'

type ConceptViewProps = {
  concept: KbConceptFragment
  currentUser: MeUserFragment | null | undefined
}

export const ConceptView: React.FC<ConceptViewProps> = ({
  concept,
  currentUser,
}) => {
  const [inEditMode, startEdit, stopEdit] = useBoolean()

  const canEdit = currentUser?.sudo || currentUser?.id === concept.createdById

  const { translateButton } =
    useTranslateButton({
      entities: BulkUpdateLangsEntityType.CONCEPT,
      id: concept.id,
    }) || {}

  return (
    <ConceptViewStyled>
      {inEditMode ? (
        <ConceptEditForm
          concept={concept}
          cancelHandler={stopEdit}
          currentUser={currentUser}
        />
      ) : (
        <>
          <ConceptItem concept={concept} variant="full" />

          {canEdit && (
            <div>
              {translateButton}

              <Button onClick={startEdit}>Edit</Button>
            </div>
          )}
        </>
      )}
    </ConceptViewStyled>
  )
}
