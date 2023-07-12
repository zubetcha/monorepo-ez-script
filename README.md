# monorepo-ez-scripts

CLI for running script of each workspace in monorepo more easily.

🙅🏻‍♀️ `deno` is not supported.

## Why

There are numerous workspaces in the monorepo. And each workspace has its own scripts in package.json.
If you want to run a script in a workspace, you must know the workspace and script name. Then, depending on the type of package manager, you need to type the command as follows.

<br/>

```bash
yarn workspace <WORKSPACE> <SCRIPT>

npm run <SCRIPT> --workspace=<WORKSPACE>

pnpm --filter "<WORKSPACE>" <SCRIPT>
```

I know we can also add an abbreviated script to root package.json. But, it would be quite cumbersome to add each time the number of workspaces and scripts increases. This project contains a command (i.e. `mes run`) that allows you to simply select a workspace and a script to run.

<br/>

## Installation and Setup

```bash
npm install --save-dev monorepo-ez-script
```

```bash
mes init // generate configuration automatically
```

<br/>

## Usage

```
$ mes help
Usage: mes [options] [command]

CLI for running workspace script easily in monorepo

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  init            Create configuration file in root directory
  run             Select workspace and run script
  help [command]  display help for command
```

<br/>

#### `mes init`

- Collect information like package manager, workspace's name, scripts.
- Then, create configuration file with above information in root directory.

```bash
$ mes init

> Creating configuration file...

> Collecting workspace information...

[====================] 2/2 100%
```

<br/>

#### `mes run`

- If there is not configuration, run `mes init` first automatically.
- If there is not `packageManager` in configuraion, apply `npm` by default.
- First, choose which `workspace` to run.
- Then, choose which `script` to run.

```bash
$ mes run
✔ Which workspace would you like to run script? › monorepo-ez-script
? Which script would you like to run? › - Use arrow-keys. Return to submit.
❯   build
    lint
    format
    prepare
    dev
```

<br/>

## Configuration

Run command `mes init`, then configuration `.mesrc.json` would be generated in root directory automatically.  
Currently, only `.mesrc.json` is supported.  
(I will do my best to support in various ways asap.)

<br/>

**`.mesrc.json` example**

```JSON
{
  "packageManager": "pnpm",
  "workspaces": [
    "monorepo-ez-script"
  ],
  "scripts": {
    "monorepo-ez-script": [
      "build",
      "lint",
      "format",
      "dev"
    ]
  }
}
```

- packageManager:
  - `npm | pnpm | yarn`
  - `deno` is not supported.
  - If there isn't packageManager, use `npm` by default.
  - If packageManager is not one of `npm`, `pnpm`, `yarn`, quit command.
- workspaces:
  - `string[]`
  - If there isn't workspaces, quit command.
  - If there isn't any workspace in workspaces (empty array), quit command.
- scripts:

  - `Record<string, string[]>`
  - Each key is workspace name and value is array including scripts key.
  - It there isn't workspace name that selected as key, quit command.
  - If workspace name that selected has empty array, quit command.

  ## License

  MIT
