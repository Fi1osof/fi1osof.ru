# Mermaid Diagrams

Embed diagrams directly in your responses using fenced code blocks:

~~~markdown
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Result]
```
~~~

## Supported Diagram Types

- **Flowchart** — `graph TD`, `graph LR`
- **Sequence Diagram** — `sequenceDiagram`
- **Class Diagram** — `classDiagram`
- **State Diagram** — `stateDiagram-v2`
- **ER Diagram** — `erDiagram`
- **Gantt Chart** — `gantt`
- **Pie Chart** — `pie`
- **Mindmap** — `mindmap`

## Configuration via Directives

Use `%%{init: {...}}%%` at the start of the diagram to customize rendering:

```mermaid
%%{init: {"theme": "dark", "look": "handDrawn"}}%%
graph TD
    A --> B
```

## Available Config Options

### Theme

```
theme: 'default' | 'base' | 'dark' | 'forest' | 'neutral' | 'neo' | 'neo-dark'
```

### Look

```
look: 'classic' | 'handDrawn' | 'neo'
```

### Other Options

- **fontFamily** — CSS font-family for text
- **fontSize** — base font size
- **darkMode** — boolean, enable dark mode
- **htmlLabels** — boolean, use HTML for labels
- **securityLevel** — `'strict' | 'loose' | 'antiscript' | 'sandbox'`
- **logLevel** — `'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'`

### Diagram-Specific Config

Each diagram type has its own config section:

```
flowchart: { ... }
sequence: { ... }
gantt: { ... }
class: { ... }
state: { ... }
er: { ... }
pie: { ... }
mindmap: { ... }
```

## Examples

### Flowchart

```mermaid
graph LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
```

### Sequence Diagram

```mermaid
sequenceDiagram
    Alice->>Bob: Hello
    Bob-->>Alice: Hi!
```

### Class Diagram

```mermaid
classDiagram
    class Animal {
        +String name
        +eat()
    }
    Animal <|-- Dog
```

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing
    Processing --> [*]
```

### ER Diagram

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains
```

### Pie Chart

```mermaid
pie title Distribution
    "A" : 40
    "B" : 30
    "C" : 30
```

### Mindmap

```mermaid
mindmap
  root((Topic))
    Branch 1
      Leaf 1
      Leaf 2
    Branch 2
```

## Hand-Drawn Style

```mermaid
%%{init: {"look": "handDrawn", "handDrawnSeed": 42}}%%
graph TD
    A[Sketch] --> B[Diagram]
```
