# Hello, world

Demo skill. Shows how to:

- build an extended description at runtime;
- mix data from the database;
- run an auxiliary shell script.

## Dynamic data

- Users in the system: **{{userCount}}**
- Render time: `{{now}}`

## Usage

The mutation `executeSkill(id: "hello-world", args: { message: "hi" })` will run
`run.sh` and return `stdout`/`stderr`/`exitCode`.
