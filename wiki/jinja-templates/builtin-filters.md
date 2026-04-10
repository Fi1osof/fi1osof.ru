# Built-in Filters

Jinja2 built-in filters commonly used in chat templates.

## String Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `trim` | Remove leading/trailing whitespace | `{{ " hello " \| trim }}` → `hello` |
| `upper` | Convert to uppercase | `{{ "hello" \| upper }}` → `HELLO` |
| `lower` | Convert to lowercase | `{{ "HELLO" \| lower }}` → `hello` |
| `capitalize` | Capitalize first letter | `{{ "hello" \| capitalize }}` → `Hello` |
| `title` | Titlecase words | `{{ "hello world" \| title }}` → `Hello World` |
| `replace(old, new)` | Replace substring | `{{ "hello" \| replace("l", "x") }}` → `hexxo` |
| `truncate(n)` | Truncate to n characters | `{{ "hello world" \| truncate(5) }}` → `he...` |
| `wordwrap(n)` | Wrap text at n characters | — |
| `center(n)` | Center in n-width string | `{{ "hi" \| center(6) }}` → `  hi  ` |
| `striptags` | Remove HTML tags | `{{ "<b>hi</b>" \| striptags }}` → `hi` |

## Type Conversion

| Filter | Description | Example |
|--------|-------------|---------|
| `tojson` | Convert to JSON string | `{{ {"a": 1} \| tojson }}` → `{"a": 1}` |
| `string` | Convert to string | `{{ 42 \| string }}` → `"42"` |
| `int` | Convert to integer | `{{ "42" \| int }}` → `42` |
| `float` | Convert to float | `{{ "3.14" \| float }}` → `3.14` |
| `list` | Convert to list | `{{ "abc" \| list }}` → `["a", "b", "c"]` |

## Safety

| Filter | Description | Example |
|--------|-------------|---------|
| `safe` | Mark as safe (no escaping) | `{{ "<b>hi</b>" \| safe }}` → `<b>hi</b>` |
| `escape` / `e` | HTML escape | `{{ "<b>" \| escape }}` → `&lt;b&gt;` |
| `forceescape` | Force escape even if safe | — |

## Default Values

| Filter | Description | Example |
|--------|-------------|---------|
| `default(val)` / `d(val)` | Fallback if undefined | `{{ x \| default("none") }}` |
| `default(val, true)` | Fallback if undefined or falsy | `{{ "" \| default("empty", true) }}` |

## List/Sequence Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `first` | First element | `{{ [1,2,3] \| first }}` → `1` |
| `last` | Last element | `{{ [1,2,3] \| last }}` → `3` |
| `length` | Number of elements | `{{ [1,2,3] \| length }}` → `3` |
| `reverse` | Reverse order | `{{ [1,2,3] \| reverse \| list }}` → `[3,2,1]` |
| `sort` | Sort elements | `{{ [3,1,2] \| sort }}` → `[1,2,3]` |
| `unique` | Remove duplicates | `{{ [1,1,2] \| unique \| list }}` → `[1,2]` |
| `join(sep)` | Join with separator | `{{ [1,2,3] \| join(",") }}` → `1,2,3` |
| `map(attr)` | Extract attribute | `{{ users \| map(attribute="name") }}` |
| `select(test)` | Filter by test | `{{ nums \| select("odd") }}` |
| `reject(test)` | Reject by test | `{{ nums \| reject("even") }}` |
| `selectattr(attr, test)` | Filter by attribute | `{{ users \| selectattr("active") }}` |
| `batch(n)` | Split into batches | `{{ [1,2,3,4] \| batch(2) }}` → `[[1,2],[3,4]]` |
| `slice(n)` | Split into n slices | — |

## Dictionary Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `dictsort` | Sort dict by key | `{{ {"b":1,"a":2} \| dictsort }}` |
| `items` | Get key-value pairs | `{{ data \| items }}` |

## Math Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `abs` | Absolute value | `{{ -5 \| abs }}` → `5` |
| `round(n)` | Round to n decimals | `{{ 3.14159 \| round(2) }}` → `3.14` |
| `sum` | Sum of elements | `{{ [1,2,3] \| sum }}` → `6` |
| `max` | Maximum value | `{{ [1,2,3] \| max }}` → `3` |
| `min` | Minimum value | `{{ [1,2,3] \| min }}` → `1` |

## Format Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `format` | Printf-style format | `{{ "%s: %d" \| format("count", 5) }}` |
| `indent(n)` | Indent lines | `{{ text \| indent(4) }}` |
| `pprint` | Pretty print | `{{ data \| pprint }}` |

## Chaining Filters

Filters can be chained:

```jinja
{{ content | trim | lower | truncate(100) }}
{{ items | map(attribute="name") | join(", ") }}
```
