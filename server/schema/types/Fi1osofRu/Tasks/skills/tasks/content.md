## Список задач

Чтобы получить список задач, выполни этот запрос

```graphql
query tasks($take: Int = 10, $skip: Int) {
  tasksCount
  tasks(take: $take, skip: $skip) {
    id
    title
    status
    description
  }
}
```

## Детальная информация по задаче

Чтобы получить детальную информацию по задаче, включая ворклоги, выполни запрос

```graphql
query task($id: String!) {
  task(where: { id: $id }) {
    id
    title
    createdAt
    createdById
    status
    description
    content

    WorkLogs {
      id
      createdAt
      createdById
      content
    }
  }
}
```

## Создание задачи

Чтобы создать новую задачу, выполни эту мутацию

```graphql
mutation createTask(
  # Заголовок. Обязательно
  $title: String!
  # Краткое описание задачи. Обязательно
  $description: String!
  # Подробное описание задачи. Обязательно
  $content: String!
  # ID родительской задачи. Не обязательно
  $parentId: String
) {
  createTask(
    data: {
      title: $title
      content: $content
      parentId: $parentId
      description: $description
    }
  ) {
    id
  }
}
```

## Создание ворклога

Чтобы создать ворклог в задаче, выполни эту мутацию

```graphql
mutation createTaskWorkLog($taskId: String!, $content: String!) {
  createTaskWorkLog(data: { taskId: $taskId, content: $content }) {
    id
  }
}
```
