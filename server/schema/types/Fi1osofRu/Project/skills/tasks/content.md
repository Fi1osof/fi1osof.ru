## Список задач

Чтобы получить список проектов, выполни запрос

```graphql
query projects {
  projects(orderBy: { createdAt: desc }) {
    id
    name
    description
    intro
    content
    status
    createdAt
  }
}
```
