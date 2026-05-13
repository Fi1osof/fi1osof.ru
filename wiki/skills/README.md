# Skills

File-based catalog of agent skills exposed via GraphQL. A skill lives in any
folder under `server/schema/types/` — typically next to the GraphQL type it
belongs to — and is identified by a `skillManifest.ts` file with a single
named export.

## Layout

```
server/schema/types/
├── Skills/
│   ├── interfaces.ts          # SkillManifest / RegisteredSkill / SkillExecutionResult
│   ├── types.ts               # Pothos `Skill` and `SkillExecutionResult` types
│   ├── registry.ts            # recursive scan, builds the in-memory map
│   ├── executor.ts            # spawns the skill executable (host process for now)
│   ├── renderTemplate.ts      # `{{path.to.value}}` substitution helper
│   ├── resolvers/
│   │   ├── skills.ts          # query skills
│   │   ├── skill.ts           # query skill(id)
│   │   └── executeSkill.ts    # mutation executeSkill
│   └── skills/
│       └── hello-world/
│           ├── skillManifest.ts   # required — named export `skillManifest`
│           ├── description.md     # optional — markdown template
│           └── run.sh             # optional — executable
└── <SomeGraphType>/
    └── <any/sub/path>/
        └── skillManifest.ts   # picked up by the registry too
```

The registry recursively scans `server/schema/types/` for files literally
named **`skillManifest.ts`**. Each match is loaded with `require()` and
registered. Skills are intentionally allowed to live under any graph-type
folder, so a skill can sit right next to the type it operates on.

### Skill identifier

The skill `id` is **the path of the skill folder relative to
`server/schema/types/`** in POSIX form. The author never assigns it manually:

| skillManifest.ts location                                        | id                          |
| ---------------------------------------------------------------- | --------------------------- |
| `server/schema/types/Skills/skills/hello-world/skillManifest.ts` | `Skills/skills/hello-world` |
| `server/schema/types/Post/moderation/skillManifest.ts`           | `Post/moderation`           |

### Required naming convention

- File name: **`skillManifest.ts`** — fixed, used by the recursive scan.
- Export: **`export const skillManifest`** — a named export, not a default.

If either is missing the skill is silently skipped (with a `console.error` in
development). This keeps the registry resilient if a half-written manifest is
checked in.

## Manifest

```ts
import { SkillManifest } from '../../interfaces'

export const skillManifest: SkillManifest = {
  name: 'Hello, world',
  description: 'Demo skill: echo call and dynamic data from the database.',
  files: ['description.md', 'run.sh'],
  executable: {
    type: 'shell', // 'shell' | 'node'
    command: 'run.sh', // path relative to the skill folder
    argsSchema: { message: 'string' }, // 'string' | 'number' | 'boolean'
  },
  buildContent: async (ctx) => {
    const userCount = await ctx.prisma.user.count()
    return renderTemplate(template, { userCount })
  },
}
```

- `name` / `description` — flat info shown in lists.
- `buildContent(ctx)` — lazy builder for the extended `content` field. Has
  full access to `PrismaContext`, so it can pull dynamic data from the DB.
- `files` — purely informational list of auxiliary files for the UI.
- `executable` — optional. When present, the `executeSkill` mutation can run
  it. Arguments declared in `argsSchema` are forwarded as `--key value` flags.

## Dynamic content rendering

`renderTemplate(template, vars)` substitutes `{{path.to.value}}` placeholders
with values from `vars`. Missing keys become an empty string. This is enough
for typical agent skills that need to inline DB-derived data into a markdown
description; a full MDX runtime is intentionally not used yet.

## GraphQL API

```graphql
type Skill {
  id: ID!
  name: String!
  description: String! # flat description, always available
  content: String # lazy — calls buildContent only if requested
  files: [String!]!
  hasExecutable: Boolean!
}

type SkillExecutionResult {
  stdout: String!
  stderr: String!
  exitCode: Int!
  durationMs: Int!
}

type Query {
  skills: [Skill!]!
  skill(id: ID!): Skill
}

type Mutation {
  executeSkill(id: ID!, args: Json): SkillExecutionResult!
}
```

The `content` field is resolved lazily — `buildContent` is only invoked if the
client selects `content`, so listing skills stays cheap.

## Executor

`runSkillExecutable(skill, args)` spawns the skill's command via Node's
`child_process.spawn`:

- `type: 'shell'` — runs `sh <command>`.
- `type: 'node'` — runs `node <command>`.
- Working directory is the skill's own folder.
- Default timeout is **60 seconds**; the process is `SIGKILL`'d on overrun.
- Args are filtered through `argsSchema` and passed as `--key value` pairs.

> **TODO (audit):** execution currently runs on the API host. It will be moved
> to an isolated Docker service together with task `001--docker-service`.
> Permission gating for listing/reading/executing skills is also pending.

## Adding a new skill

1. Create a folder anywhere under `server/schema/types/` (typically next to
   the relevant GraphQL type) with a `skillManifest.ts` file that exports a
   `skillManifest: SkillManifest` named constant.
2. Add any auxiliary files (markdown templates, shell scripts) next to it.
3. Restart `npm run dev` — the registry picks up the new skill on boot.
4. Verify in GraphQL Playground:

```graphql
query {
  skills {
    id
    name
    description
    hasExecutable
  }
}
```

## Build notes

- The registry currently looks for `skillManifest.ts` only. In production the
  files are compiled to `.js`, so the scanner needs to be extended (or run
  through `tsx`) when wiring skills into a `tsc`-built bundle.
- `copy-statics:server` copies `*.md` into `dist/`. **Non-markdown auxiliary
  files (e.g. `run.sh`) are not copied yet** — extend the `copyfiles` glob in
  `package.json` if/when shell-based skills need to run in production.
