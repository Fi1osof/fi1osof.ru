# Agent World — Data Structures

## WorldNode

```typescript
interface WorldNode {
  id: string           // Unique ID (6 HEX characters)
  type: string         // Node type: root, user, task, article, etc.
  name: string         // Display name
  data: Record<string, unknown>  // Arbitrary data
  meta: NodeMeta       // System metadata
  children: WorldNode[] // Child nodes
}
```

## NodeMeta

```typescript
interface NodeMeta {
  createdAt: string    // ISO timestamp of creation
  updatedAt: string    // ISO timestamp of last modification
  lastReadAt: string   // ISO timestamp of last read
  readCount: number    // Read counter
  depthLevel: number   // Depth level (0-10)
}
```

## WorldData

```typescript
interface WorldData {
  id: string           // World ID (agentId or agentId:ownerId)
  agentId: string      // Agent ID
  ownerId?: string     // Owner ID (for user isolation)
  root: WorldNode      // Root node
  createdAt: string    // ISO timestamp of world creation
  updatedAt: string    // ISO timestamp of last modification
}
```

## ReadOptions

```typescript
interface ReadOptions {
  maxDepth?: number      // Maximum read depth (default: 2)
  expandNodeIds?: string[] // Node IDs for deep expansion
}
```

## World Structure Example

```json
{
  "id": "root",
  "type": "root",
  "name": "World",
  "data": {},
  "meta": {
    "createdAt": "2026-03-23T06:00:00.000Z",
    "updatedAt": "2026-03-23T06:30:00.000Z",
    "lastReadAt": "2026-03-23T06:30:00.000Z",
    "readCount": 5,
    "depthLevel": 0
  },
  "children": [
    {
      "id": "A1B2C3",
      "type": "user",
      "name": "John Doe",
      "data": { "email": "john@example.com" },
      "meta": { ... },
      "children": [
        {
          "id": "D4E5F6",
          "type": "task",
          "name": "Review PR",
          "data": { "status": "pending", "priority": "high" },
          "meta": { ... },
          "children": []
        }
      ]
    }
  ]
}
```
