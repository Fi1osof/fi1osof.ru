# Read Web Page

Mutation to load a web page and convert HTML to Markdown.

## GraphQL Query

```graphql
mutation readWebPage(
  $url: String!
  $selector: String
  $maxLength: Int
  $timeout: Int
  $userAgent: String
  $outputFormat: OutputFormat
) {
  readWebPage(
    url: $url
    selector: $selector
    maxLength: $maxLength
    timeout: $timeout
    userAgent: $userAgent
    outputFormat: $outputFormat
  )
}
```

## Arguments

| Argument    | Type   | Required | Description                              |
|-------------|--------|----------|------------------------------------------|
| `url`       | String | yes      | URL of the page to load (with protocol)  |
| `selector`  | String | no       | CSS selector to extract a specific part  |
| `maxLength` | Int    | no       | Maximum content length in characters     |
| `timeout`   | Int    | no       | Request timeout in ms (default 30000)    |
| `userAgent` | String | no       | Custom User-Agent header                 |
| `outputFormat` | OutputFormat | no | Output format: markdown (default), html, or text |

## Response

```json
{
  "url": "https://example.com",
  "finalUrl": "https://example.com/",
  "statusCode": 200,
  "title": "Page Title",
  "description": "Meta description",
  "content": "# Heading\n\nMarkdown content...",
  "contentLength": 12345,
  "error": null
}
```

## Response Fields

| Field          | Type          | Description                                    |
|----------------|---------------|------------------------------------------------|
| `url`          | String        | Original requested URL                         |
| `finalUrl`     | String        | Final URL after redirects                      |
| `statusCode`   | Int           | HTTP status code (0 if request failed)         |
| `title`        | String        | Page title from `<title>` tag                  |
| `description`  | String        | Meta description or OG description             |
| `content`      | String        | Page content converted to Markdown             |
| `contentLength`| Int           | Full content length before truncation          |
| `error`        | String\|null  | Error message if request failed, null otherwise|

## Usage Examples

### Load entire page
```graphql
mutation {
  readWebPage(url: "https://example.com")
}
```

### Extract article only
```graphql
mutation {
  readWebPage(url: "https://blog.com/post", selector: "article")
}
```

### Limit length to save tokens
```graphql
mutation {
  readWebPage(url: "https://docs.com", maxLength: 5000)
}
```

### Custom timeout and User-Agent
```graphql
mutation {
  readWebPage(
    url: "https://slow-site.com"
    timeout: 60000
    userAgent: "MyBot/1.0"
  )
}
```

### Get raw HTML
```graphql
mutation {
  readWebPage(url: "https://example.com", outputFormat: html)
}
```

### Get plain text only
```graphql
mutation {
  readWebPage(url: "https://example.com", outputFormat: text)
}
```
