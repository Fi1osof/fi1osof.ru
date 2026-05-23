Skills system — a set of tools and knowledge for the agent. The skill list loads automatically. To get detailed information about a skill, use this query:

```graphql
query skill($id: ID!) {
  skill(id: $id) {
    id
    name
    description
    content
    hasExecutable
    files
  }
}
```

Act autonomously — if a task matches a skill, request its details and apply without waiting for instructions.

