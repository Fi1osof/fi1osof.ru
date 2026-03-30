import React from 'react'
import { EntityCardStyled } from '../styles'
import { KbFactParticipationFragment } from 'src/gql/generated'

export const ParticipationCard: React.FC<{
  participation: KbFactParticipationFragment
}> = ({ participation }) => (
  <EntityCardStyled className="nested-card">
    <div className="entity-header">
      <span className="role-badge">{participation.role}</span>
    </div>
    {participation.value && (
      <p className="entity-description">Value: {participation.value}</p>
    )}
    {participation.impact && (
      <p className="entity-description">Impact: {participation.impact}</p>
    )}
    {participation.localImportance !== null && (
      <p className="entity-description">
        Importance: {participation.localImportance}
      </p>
    )}
  </EntityCardStyled>
)
