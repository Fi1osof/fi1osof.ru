# Routing

Custom URL routing system for SEO-friendly paths.

## SiteRoute Model

Database table linking custom paths to content:
- **path** — full URL path (unique), e.g. `/my-article`
- **slug** — short segment identifier
- **parentId** — reference to parent SiteRoute (hierarchical structure)
- **kBConceptId** — link to KBConcept (1:1)
- **rank** — sort order

## How It Works

1. Next.js fallback rewrite redirects unknown paths to `/_fallback/[...path].tsx`
2. Fallback page queries `SiteRoute` by current path via GraphQL
3. If found and linked to `kBConceptId` → renders `ConceptPage`
4. Otherwise → 404

## Virtual `uri` Field

KBConcept exposes `uri` field that returns:
- Custom path from SiteRoute if exists
- Default `/concepts/{id}` otherwise

## Link Components

Located in `src/components/Link/`:
- **ConceptLink** — uses `uri` for SEO-friendly concept links
- **PostLink**, **TaskLink**, **WorkLogLink** — similar pattern for other entities
