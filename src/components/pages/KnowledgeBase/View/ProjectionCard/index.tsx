import React from 'react'
import { EntityCardStyled } from '../styles'
import { KbFactProjectionFragment } from 'src/gql/generated'

export const ProjectionCard: React.FC<{
  projection: KbFactProjectionFragment
}> = ({ projection }) => (
  <EntityCardStyled className="nested-card">
    <div className="entity-header">
      <span className="visibility-badge">{projection.visibility}</span>
    </div>
    <div className="entity-meta">
      {projection.trustLevel !== null && (
        <span className="meta-item">
          Trust: <strong>{projection.trustLevel}</strong>
        </span>
      )}
      {projection.importance !== null && (
        <span className="meta-item">
          Importance: <strong>{projection.importance}</strong>
        </span>
      )}
    </div>
    {projection.notes && (
      <p className="entity-description">{projection.notes}</p>
    )}
  </EntityCardStyled>
)
