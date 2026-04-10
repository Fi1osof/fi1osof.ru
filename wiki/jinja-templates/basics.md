# Basics

Jinja2 syntax fundamentals for chat templates.

## Output Expressions

```jinja
{{ variable }}
{{ message.role }}
{{ items | tojson }}
```

## Statements

```jinja
{% if condition %}
    ...
{% elif other %}
    ...
{% else %}
    ...
{% endif %}

{% for item in items %}
    {{ item }}
{% endfor %}

{% set name = value %}
```

## Whitespace Control

By default, Jinja preserves whitespace. Use `-` to strip it:

```jinja
{%- if true -%}
    no extra whitespace
{%- endif -%}
```

- `{%-` — strip whitespace before
- `-%}` — strip whitespace after
- Same for `{{-` and `-}}`

## Filters

Transform values with `|`:

```jinja
{{ content | trim }}
{{ data | tojson }}
{{ html | safe }}
{{ name | upper }}
```

Common filters:
- **trim** — remove leading/trailing whitespace
- **tojson** — convert to JSON string
- **safe** — mark as safe HTML (no escaping)
- **upper** / **lower** — case conversion
- **default(value)** — fallback if undefined

## Variables

```jinja
{% set name = 'value' %}
{% set count = 0 %}
```

### Mutable Variables in Loops

Regular variables are immutable in loop scope. Use `namespace`:

```jinja
{%- set counter = namespace(value=0) %}
{%- for item in items %}
    {%- set counter.value = counter.value + 1 %}
{%- endfor %}
{{ counter.value }}
```

## Macros

Reusable template functions:

```jinja
{%- macro greet(name) %}
Hello, {{ name }}!
{%- endmacro %}

{{ greet('World') }}
```

## Tests

Check conditions with `is`:

```jinja
{% if value is defined %}
{% if value is none %}
{% if value is string %}
{% if items is iterable %}
{% if data is mapping %}
```

## Loop Variables

Inside `{% for %}`:

| Variable | Description |
|----------|-------------|
| `loop.index` | 1-based index |
| `loop.index0` | 0-based index |
| `loop.first` | True if first iteration |
| `loop.last` | True if last iteration |
| `loop.previtem` | Previous item |
| `loop.nextitem` | Next item |

## String Operations

```jinja
{{ 'Hello ' ~ name }}           {# concatenation #}
{{ text.startswith('prefix') }}
{{ text.endswith('suffix') }}
{{ text.split(',') }}
```

## Error Handling

```jinja
{{ raise_exception('Error message') }}
```
