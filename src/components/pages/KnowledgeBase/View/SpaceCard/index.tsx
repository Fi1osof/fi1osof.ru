import React from 'react'
import { EntityCardStyled } from '../styles'
import { KbKnowledgeSpaceFragment } from 'src/gql/generated'

export const SpaceCard: React.FC<{ space: KbKnowledgeSpaceFragment }> = ({
  space,
}) => (
  <EntityCardStyled>
    <div className="entity-header">
      <strong>{space.name}</strong>
      <span className="entity-type">{space.type}</span>
    </div>
    {space.description && (
      <p className="entity-description">{space.description}</p>
    )}
  </EntityCardStyled>
)
