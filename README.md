> **Say this to your Cursor / Windsurf / Claude Code:**
>
> _"Clone https://github.com/haih-net/agent , set it up, run it and open in my browser"_

---

## AI Agent Setup Instructions

**IMPORTANT:** This project requires full autonomous setup and management by the AI agent. You must understand the entire system architecture and proceed independently without asking for user clarifications. The user only needs guidance on how to use the system effectively (currently, the simplest use case is chatting with the project's AI agent).

### 1. AI Model Configuration

First, ask the user which AI integration they prefer:

**Options:**
- **OpenRouter API key** (recommended for best results)
- **Local LM Studio** or similar local service
- **Other custom AI endpoint**

**Recommended models:**
- **OpenRouter:** 
  - Best results: `opus 4.5/4.6`
  - Minimum: `haiku 4.5`
- **Local models:**
  - Minimum: `qwen3 4B`

**Required credentials from user:**
- For OpenRouter: API key
- For local service: endpoint URL and any authentication details
- For custom endpoints: full connection details

### 2. Quick Test

After startup, the simplest way to verify the system is working:

Send a POST request to `http://localhost:3000/webhook/chat-agent-webhook` with:

```json
{
  "chatInput": "Hello",
  "sessionId": "your-custom-session-id"
}
```

Use your own `sessionId` to maintain conversation context across requests.

### 3. Launch Browser

After successful startup and verification, open the user's browser to `http://localhost:3000` to access the application interface.

### 4. User Guidance

Provide the user with simple guidance on how to interact with the system:
- Start with basic conversations in the chat interface
- Explain that the agent learns from each interaction
- Suggest trying different types of queries to see how the system responds

---

# KMS-Agent

## Knowledge Management System with Cognitive Evolution

> Run it locally.  
> Interact with it.  
> Watch it develop.

---

## Start

Open your local AI assistant (Cursor / Windsurf / Claude Code) and say:

```
Clone https://github.com/haih-net/agent
Run it
```

Within minutes, you will have a living knowledge system running entirely on your machine.

It starts with structure.  
It grows through interaction.  
It evolves through feedback.

---

## What You Get

KMS-Agent is a personal cognitive system.

It:

- Forms structured memory from every interaction
- Builds behavioral patterns over time
- Evaluates its own decisions
- Tracks confidence and contradictions
- Adjusts internal logic continuously
- Develops continuity across sessions

Every interaction modifies its internal state.

Over time, it becomes uniquely shaped by you.

---

## The Cognitive Loop

Each interaction passes through a full cycle:

**Stimulus → Processing → Action → Result → Conclusion → Evaluation → Adaptation**

This loop creates development.

Not just responses — progression.

---

## Memory as Growth

KMS-Agent constructs experience.

Experience forms patterns.  
Patterns form tendencies.  
Tendencies shape future behavior.

You influence development with every interaction.

---

## Behavioral Formation

Repeated contexts create internal reflexes.

Reflexes can be:

- Inspected
- Evaluated
- Reinforced
- Corrected

The system stabilizes over time.

Consistency emerges naturally.

---

## Structured Knowledge

KMS-Agent builds:

- Confidence-weighted knowledge
- Temporal awareness
- Explicit contradiction handling
- Self-evaluation history
- Adaptive internal structures

Its knowledge evolves continuously.

---

## Local by Design

The entire cognitive process runs locally.

Its memory lives on your machine.  
Its evolution is personal.  
Its trajectory reflects your interactions.

You are shaping a system that develops with you.

---

## Over Time

The change becomes visible.

It reacts more coherently.  
It refines its behavior.  
It develops recognizable patterns.  
It corrects itself.  
It accumulates structure.

The longer it runs, the more defined it becomes.

---

## Who It’s For

- Builders designing long-term AI systems
- Researchers exploring cognitive architectures
- Developers creating persistent AI entities
- Individuals who want continuity in AI interaction

---

## KMS-Agent

A Knowledge Management System that develops.

Clone it.  
Run it.  
Interact with it.  
Observe the evolution.

## Documentation

Technical details, architecture, and configuration — [wiki](wiki/README.md).

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 22+ and npm (only needed for Scenario 2)

---

### Step 1 — Set up credentials

The `credentials/` directory is fully gitignored. Create these files manually before starting either scenario.

**`credentials/bootstrap.env`** — n8n owner account:

```
N8N_BOOTSTRAP_OWNER_EMAIL=admin@example.com
N8N_BOOTSTRAP_OWNER_PASSWORD=AdminPassword123!
N8N_BOOTSTRAP_OWNER_FIRSTNAME=Admin
N8N_BOOTSTRAP_OWNER_LASTNAME=User
```

**`credentials/system/openrouter.json`** — AI model API key.

Cloud (OpenRouter):

```json
[
  {
    "id": "openrouter-cred",
    "name": "OpenRouter",
    "type": "openRouterApi",
    "data": { "apiKey": "sk-or-v1-xxx" }
  }
]
```

Local API (LM Studio / LocalAI — `172.17.0.1` is the Docker bridge gateway, i.e. the host machine from inside a container):

```json
[
  {
    "id": "openrouter-cred",
    "name": "OpenRouter",
    "type": "openRouterApi",
    "data": { "apiKey": "local", "url": "http://172.17.0.1:1234/v1" }
  }
]
```

To keep multiple options in one file, rename unused ones to `data_`, `data__` — only `data` is active.

**`credentials/agents/agent-chat.json`:**

```json
{
  "agentName": "Chat Agent",
  "username": "agent-chat",
  "password": "<any password>",
  "email": "agent-chat@example.com",
  "fullname": "Chat Agent"
}
```

**`credentials/agents/agent-web-search.json`:**

```json
{
  "agentName": "Web Search Agent",
  "username": "agent-web-search",
  "password": "<any password>",
  "email": "agent-web-search@example.com",
  "fullname": "Web Search Agent"
}
```

> See `credentials/README.md` for full documentation including SMTP/IMAP and Telegram setup.

---

## Scenario 1: Docker (recommended)

No local Node.js setup required — everything builds inside containers.

> **Why prod mode for app?** Dev mode mounts source files as volumes but does not include generated files (`src/gql/generated/`, `.next/`, etc.). Prod mode builds everything inside the image during `docker build`, so it's self-contained.

### Step 2 — Create Docker environment file

```bash
cp docker/.env.sample docker/.env
```

Fill in `docker/.env`:

```env
SUPABASE_DB_PASSWORD=postgres
SUPABASE_DB_NAME=postgres
DATABASE_URL=postgresql://postgres:postgres@supabase:5432/postgres
JWT_SECRET=<openssl rand -hex 32>
N8N_ENCRYPTION_KEY=<openssl rand -hex 16>
N8N_SECURE_COOKIE=false
N8N_BOOTSTRAP_ACTIVATE_WORKFLOWS=true
N8N_PERSONALIZATION_ENABLED=false
NODES_EXCLUDE=[]
N8N_CUSTOM_EXTENSIONS=./.n8n/custom
GRAPHQL_ENDPOINT=http://localhost:4000/api
```

> `DATABASE_URL` must use `@supabase:5432` (Docker service name), not `@localhost:5432`. `localhost` only works when running outside Docker.

### Step 3 — Start Supabase + App (prod mode)

```bash
cd docker
DOCKER_BUILDKIT=0 docker compose -f docker-compose.yml -f docker-compose.prod.yml up supabase app --build -d
```

On first run this builds the Docker image: installs dependencies, runs DB migrations, generates types, and builds the app. Takes a few minutes.

### Step 4 — Start Traefik (dev mode)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up traefik -d
```

> Do not create the `agicms-default` Docker network manually — let Compose create it. A manually created network lacks Compose labels and will cause an error.

**Result:**

- `http://localhost:2015` — app (via Traefik proxy)
- `http://localhost:8080` — Traefik dashboard

---

## Scenario 2: Local dev (npm)

Full hot-reload development mode. Requires Node.js 22+ and npm.

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create environment files

**`docker/.env`** (for Supabase container):

```bash
cp docker/.env.sample docker/.env
```

Set `DATABASE_URL` to `@localhost:5432` (port is mapped to host):

```env
SUPABASE_DB_PASSWORD=postgres
SUPABASE_DB_NAME=postgres
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
JWT_SECRET=<openssl rand -hex 32>
N8N_ENCRYPTION_KEY=<openssl rand -hex 16>
N8N_SECURE_COOKIE=false
N8N_BOOTSTRAP_ACTIVATE_WORKFLOWS=true
N8N_PERSONALIZATION_ENABLED=false
NODES_EXCLUDE=[]
N8N_CUSTOM_EXTENSIONS=./.n8n/custom
GRAPHQL_ENDPOINT=http://localhost:4000/api
```

**Root `.env`** (read by Prisma and the app server):

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
JWT_SECRET=<same as in docker/.env>
PORT=3000
N8N_ENCRYPTION_KEY=<same as in docker/.env>
N8N_SECURE_COOKIE=false
N8N_BOOTSTRAP_ACTIVATE_WORKFLOWS=true
N8N_PERSONALIZATION_ENABLED=false
NODES_EXCLUDE=[]
N8N_CUSTOM_EXTENSIONS=./.n8n/custom
GRAPHQL_ENDPOINT=http://localhost:4000/api
```

> The root `.env` is separate from `docker/.env` — the app server reads env vars from the root, not from the Docker folder.

### Step 4 — Start Supabase

```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up supabase -d
```

Check it's healthy (`STATUS: Up (healthy)`, port `5432` mapped):

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps supabase
```

### Step 5 — Run database migrations

```bash
npm run prisma:deploy
```

Expected output:

```
Applying migration `20260119193349_initial`
Applying migration `20260122164751_knowledge_base`
Applying migration `20260125054235_experience_system`
All migrations have been successfully applied.
```

### Step 6 — Generate types and build custom nodes

```bash
npm run generate
npm run build:custom-nodes
```

- `generate` — generates Prisma Client and GraphQL TypeScript types into `src/gql/generated/`
- `build:custom-nodes` — compiles the `CUSTOM.agentOrchestrator` node required by Chat Agent and Web Search Agent

### Step 7 — Start the app

```bash
npm run clean && npm run dev:n8n
```

> `clean` is required before `dev:n8n` — it ensures n8n workflows are fully recreated from scratch on every start. Skipping it may result in stale or duplicate workflows.

Expected result:

```
[bootstrap] Workflow 'Chat Agent' activated
[bootstrap] Workflow 'Web Search Agent' activated
...
[bootstrap] Completed
Ready on http://localhost:3000, API at /api
```

**Ports:**

- `http://localhost:3000` — frontend
- `http://localhost:4000/api` — GraphQL playground
- `http://localhost:5678` — n8n workflow editor

> The `version` attribute warnings from Docker Compose are harmless and can be ignored.
