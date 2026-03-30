import React from 'react'
import { EntityCardStyled, NestedListStyled } from '../styles'
import { ParticipationCard } from '../ParticipationCard'
import { ProjectionCard } from '../ProjectionCard'
import { EnrichedFact } from '../interfaces'

export const FactCard: React.FC<{
  enrichedFact: EnrichedFact
  nested?: boolean
  showSource?: boolean
}> = ({ enrichedFact, nested = false, showSource = false }) => (
  <EntityCardStyled className={nested ? 'nested-card' : undefined}>
    <div className="entity-header">
      <strong>{enrichedFact.fact.statement}</strong>
      <span className="entity-type">{enrichedFact.fact.type}</span>
    </div>
    <div className="entity-meta">
      <span className="meta-item">
        Confidence: <strong>{enrichedFact.fact.confidence}</strong>
      </span>
      <span className="meta-item">
        Status: <strong>{enrichedFact.fact.status}</strong>
      </span>
      {enrichedFact.fact.validFrom && !showSource && (
        <span className="meta-item">
          Valid from:{' '}
          <strong>
            {new Date(enrichedFact.fact.validFrom).toLocaleDateString()}
          </strong>
        </span>
      )}
      {showSource && enrichedFact.fact.source && (
        <span className="meta-item">
          Source: <strong>{enrichedFact.fact.source}</strong>
        </span>
      )}
    </div>

    {nested && enrichedFact.participations.length > 0 && (
      <div className="nested-section">
        <h5>Participations</h5>
        <NestedListStyled className="nested">
          {enrichedFact.participations.map((participation) => (
            <ParticipationCard
              key={participation.id}
              participation={participation}
            />
          ))}
        </NestedListStyled>
      </div>
    )}

    {nested && enrichedFact.projections.length > 0 && (
      <div className="nested-section">
        <h5>Projections ({enrichedFact.projections.length})</h5>
        <NestedListStyled className="nested">
          {enrichedFact.projections.map((projection) => (
            <ProjectionCard key={projection.id} projection={projection} />
          ))}
        </NestedListStyled>
      </div>
    )}
  </EntityCardStyled>
)
