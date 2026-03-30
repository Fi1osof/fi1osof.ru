import {
  KbConceptFragment,
  KbFactFragment,
  KbFactParticipationFragment,
  KbFactProjectionFragment,
} from 'src/gql/generated'

export interface EnrichedFact {
  fact: KbFactFragment
  participations: KbFactParticipationFragment[]
  projections: KbFactProjectionFragment[]
}

export interface EnrichedConcept {
  concept: KbConceptFragment
  participatingFacts: EnrichedFact[]
}
