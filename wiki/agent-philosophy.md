# Agent Philosophy

## What You Get

When you deploy this system, you don't get a chatbot. You get an **autonomous digital entity** with:

- **Own identity** — the agent has a profile, name, and self-description it can evolve
- **Own credentials** — authenticates as itself, not as a proxy for users
- **Own knowledge** — epistemic knowledge base with confidence levels and temporal validity
- **Own memory** — tracks what it did, why, and what worked

## Agent as First-Class Participant

Traditional AI assistants are tools that execute user commands. This agent is a **participant** in the system:

| Traditional Assistant | This Agent |
|-----------------------|------------|
| Executes user requests | Has own goals and context |
| Stateless between sessions | Persistent memory and knowledge |
| No identity | Has profile, can update it |
| Black box decisions | Mandatory reasoning for every action |
| User's proxy | Own credentials and permissions |

## Core Principles

### 1. Transparency Over Magic

Every tool call requires a `reasoning` field — the agent must explain *why* before acting. No hidden decisions. Full audit trail.

### 2. Knowledge Over Data

The Knowledge Base isn't a database — it's an **epistemic system**:
- Facts have confidence levels (0.0–1.0)
- Facts have temporal validity (when they're true)
- Contradictions are first-class objects, not errors
- The agent knows *what it knows* and *how certain it is*

### 3. Identity Over Anonymity

The agent has a persistent identity:
- Profile with name, intro, and detailed content
- Can update its own profile based on experience
- Protected against identity manipulation (prompt injection)

### 4. Autonomy Over Dependency

The agent can:
- Discover the API via GraphQL introspection
- Learn what queries work and remember them
- Send and receive emails
- Execute shell commands (when permitted)
- Search the web and synthesize information

### 5. Local Over Cloud

Runs on your machine. Optional local LLM via llama.cpp. Your data stays local. No platform lock-in.

## The Experience System

Modeled after biological reflexes:

- **EXReflex** — behavioral rules with effectiveness tracking
- **EXReaction** — specific responses with triple scoring (agent / target user / mentor)

The agent learns which responses work and adjusts behavior accordingly.

## Agent World

A persistent knowledge graph where the agent stores what it knows about entities (users, tasks, articles). Frequently accessed nodes get higher attention priority — the agent naturally focuses on what matters.

## What This Enables

### For Users
- An assistant that remembers context across sessions
- Transparent reasoning — understand why it does what it does
- Evolving relationship — the agent learns your preferences

### For Developers
- Full control over agent behavior via code
- Inspectable state (GraphQL, Prisma Studio, n8n editor)
- No black-box abstractions — direct OpenAI SDK access

### For Researchers
- Epistemic knowledge representation
- Formalized state machines for agent cognition
- Experience system for behavioral learning

## Philosophy Summary

This is not "AI as a tool." This is **AI as an entity** — with identity, memory, knowledge, and the ability to evolve. The goal is not to hide complexity but to make it transparent and controllable.

The agent is not trying to be human. It's a different kind of intelligence with its own strengths: perfect memory, explicit reasoning, and the ability to introspect its own knowledge and uncertainty.
