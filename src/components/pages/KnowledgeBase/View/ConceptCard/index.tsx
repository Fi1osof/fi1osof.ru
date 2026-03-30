import React from 'react'
import { EntityCardStyled, NestedListStyled } from '../styles'
import { FactCard } from '../FactCard'
import { EnrichedConcept } from '../interfaces'
import { Markdown } from 'src/components/Markdown'

export const ConceptCard: React.FC<{ enriched: EnrichedConcept }> = ({
  enriched,
}) => (
  <EntityCardStyled>
    <div className="entity-header">
      <strong>{enriched.concept.name}</strong>
      {enriched.concept.type && (
        <span className="entity-type">{enriched.concept.type}</span>
      )}
    </div>

    {enriched.concept.description && (
      <Markdown className="entity-description">
        {enriched.concept.description}
      </Markdown>
    )}

    {enriched.concept.content && (
      <Markdown>{enriched.concept.content}</Markdown>
    )}

    {enriched.participatingFacts.length > 0 && (
      <div className="nested-section">
        <h4>Participating Facts ({enriched.participatingFacts.length})</h4>
        <NestedListStyled className="nested">
          {enriched.participatingFacts.map((enrichedFact) => (
            <FactCard
              key={enrichedFact.fact.id}
              enrichedFact={enrichedFact}
              nested
            />
          ))}
        </NestedListStyled>
      </div>
    )}
  </EntityCardStyled>
)
