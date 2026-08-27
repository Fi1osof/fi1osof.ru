# Validate Concepts

The `validateConcepts` mutation checks internal links in knowledge base concepts and finds broken ones (pointing to non-existent URIs).

## Parameters

- **where** — filter for selecting concepts (optional)
- **write** — write mode: `true` — automatically replace broken links with plain text, `false` — validation only
- **limit** — maximum number of concepts to process

## Important Note

**Only concepts with `visibility: public` are validated.** Private concepts are excluded from validation regardless of the `where` filter.

## Access Rights

**The `write: true` parameter is available only for sudo users.**

- **Sudo users**: can run with `write: true` — broken links are automatically replaced with plain text in the database.
- **Regular users**: only validation is available (`write: false`) — they receive a list of concepts with broken links. If a concept is editable by the user, they must update its content manually.

## Example Query

```graphql
mutation validateConcepts($where: KBConceptWhereInput, $write: Boolean!, $limit: Int!) {
  validateConcepts(where: $where, write: $write, limit: $limit)
}
```

## Response

```json
{
  "total": 100,
  "success": 95,
  "skipped": 2,
  "failed": [
    {
      "concept": { "id": "...", "uri": "..." },
      "invalidLinks": [
        { "uri": "/broken/link", "text": "Link text" }
      ]
    }
  ]
}
```

- **total** — total concepts processed
- **success** — concepts without broken links
- **skipped** — skipped (empty content)
- **failed** — list of concepts with broken links or errors
