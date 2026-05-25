# Read Web Page

Load a web page and convert it to Markdown for AI agent analysis.

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
| ----------- | ------ | -------- | ---------------------------------------- |
| `url`       | String | yes      | URL of the page to load (with protocol)  |
| `selector`  | String | no       | CSS selector to extract a specific part  |
| `maxLength` | Int    | no       | Maximum content length in characters     |
| `timeout`   | Int    | no       | Request timeout in ms (default 30000)    |
| `userAgent` | String | no       | Custom User-Agent header                 |
| `outputFormat` | OutputFormat | no | Output format: markdown (default), html, or text |
