import React, { useMemo } from 'react'
import {
  useFactsQuery,
  useFactParticipationsQuery,
  useKnowledgeSpacesQuery,
  useFactProjectionsQuery,
  useConceptsQuery,
  SortOrder,
} from 'src/gql/generated'
import { ViewStyled, SectionStyled, NestedListStyled } from './styles'
import { SpaceCard } from './SpaceCard'
import { ConceptCard } from './ConceptCard'
import { FactCard } from './FactCard'
import { EnrichedConcept, EnrichedFact } from './interfaces'

export const KnowledgeBaseView: React.FC = () => {
  const { data: conceptsData } = useConceptsQuery({
    variables: {
      take: 10,
      orderBy: {
        createdAt: SortOrder.ASC,
      },
    },
  })
  const { data: factsData } = useFactsQuery({
    variables: {
      take: 10,
    },
  })
  const { data: participationsData } = useFactParticipationsQuery({
    variables: {
      take: 10,
    },
  })
  const { data: knowledgeSpacesData } = useKnowledgeSpacesQuery({
    variables: {
      take: 10,
    },
  })
  const { data: projectionsData } = useFactProjectionsQuery({
    variables: {
      take: 10,
    },
  })

  const enrichedData = useMemo(() => {
    const concepts = conceptsData?.response || []
    const facts = factsData?.response || []
    const participations = participationsData?.response || []
    const spaces = knowledgeSpacesData?.response || []
    const projections = projectionsData?.response || []

    const enrichedFacts: Map<string, EnrichedFact> = new Map()

    facts.forEach((fact) => {
      if (fact.id) {
        enrichedFacts.set(fact.id, {
          fact,
          participations: participations.filter((p) => p.factId === fact.id),
          projections: projections.filter((p) => p.factId === fact.id),
        })
      }
    })

    const enrichedConcepts: EnrichedConcept[] = concepts.map((concept) => ({
      concept,
      participatingFacts: participations
        .filter((p) => p.conceptId === concept.id)
        .map((p) => enrichedFacts.get(p.factId || ''))
        .filter((f) => f !== undefined),
    }))

    return {
      concepts: enrichedConcepts,
      facts: Array.from(enrichedFacts.values()),
      spaces,
    }
  }, [
    conceptsData,
    factsData,
    participationsData,
    knowledgeSpacesData,
    projectionsData,
  ])

  return (
    <ViewStyled>
      <h1>Knowledge Base</h1>

      <SectionStyled>
        <h2>Knowledge Spaces ({enrichedData.spaces.length})</h2>
        {enrichedData.spaces.length > 0 ? (
          <NestedListStyled>
            {enrichedData.spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </NestedListStyled>
        ) : (
          <p>No knowledge spaces found</p>
        )}
      </SectionStyled>

      <SectionStyled>
        <h2>Concepts ({enrichedData.concepts.length})</h2>
        {enrichedData.concepts.length > 0 ? (
          <NestedListStyled>
            {enrichedData.concepts.map((enriched) => (
              <ConceptCard key={enriched.concept.id} enriched={enriched} />
            ))}
          </NestedListStyled>
        ) : (
          <p>No concepts found</p>
        )}
      </SectionStyled>

      <SectionStyled>
        <h2>All Facts ({enrichedData.facts.length})</h2>
        {enrichedData.facts.length > 0 ? (
          <NestedListStyled>
            {enrichedData.facts.map((enrichedFact) => (
              <FactCard
                key={enrichedFact.fact.id}
                enrichedFact={enrichedFact}
                showSource
              />
            ))}
          </NestedListStyled>
        ) : (
          <p>No facts found</p>
        )}
      </SectionStyled>
    </ViewStyled>
  )
}
