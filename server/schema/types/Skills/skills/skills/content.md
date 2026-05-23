# Skills System

The skills system provides the agent with a set of tools and knowledge for completing tasks.

## How it works

1. **Skill list** loads automatically at session start
2. Each skill contains a brief `description` — use it to understand the purpose
3. When you need **detailed information** — request the full skill content

## Getting detailed information

Use the GraphQL query:

```graphql
query skill($id: ID!) {
  skill(id: $id) {
    id
    name
    description
    content       # Full skill documentation
    hasExecutable # Whether an executable script exists
    files         # Related files
  }
}
```

## Response fields

- **content** — detailed documentation, examples, instructions
- **hasExecutable** — if `true`, the skill can be executed via `executeSkill`
- **files** — list of files related to the skill (code, configs, examples)

## Executing a skill

If `hasExecutable: true`, you can call:

```graphql
mutation executeSkill($id: ID!, $args: JSON) {
  executeSkill(id: $id, args: $args) {
    stdout
    stderr
    exitCode
  }
}
```

## Usage principles

- Act **autonomously** — don't wait for explicit instructions from the user
- If a task matches a skill — request its details and apply
- Skills contain up-to-date knowledge about the project and its tools
