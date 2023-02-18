# Contributing

TBD

## Committing

### TL;DR

1. Add code, `git add` it
2. Run `git commit` without any message. Gitmoji CLI will pop up automatically unless you ignore git
   hooks.

```sh
git commit
```

3. Choose emoji via the picker
4. Add conventional-commits type (`feat:`, `fix:`, `chore:` and all that)
5. Add commit message
6. All done! :sparkles:

Should be something like this in the end:

`:sparkles: feat: Add awesomeness`

## Commit conventions

`ordo-electron` uses [gitmoji](https://gitmoji.dev) commit convention paired with
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

- Every commit MUST start with a type represented by one of commit types listed on
  [gitmoji.dev](https://gitmoji.dev/). Do not use emoji icons - only code values (e.g. :art :,
  :sparkles :, etc.)
- Every commit MUST have a defined conventional commits type after the emoji commit type, separated
  with a space (` `). Conventional commits type MUST be followed with a colon (`:`) and a space
  (` `). The conventional commits type MUST describe the type of changes to (e.g. `build: `,
  `feat: `, `fix: `, `chore: `, etc.). The list of conventional commits types is defined below
- Every commit MUST have a short description of the commit content after the commit scope

### Conventional-commits types

- build
- ci
- docs
- feat
- fix
- perf
- refactor
- revert
- style
- test
- chore
- wip

### Most common emoji commit types

- :sparkles : - adding new feature
- :bug : - fixing a bug
- :lock : - fixing security vulnerability
- :zap : - improving performance
- :lipstick : - making changes to the UI and styles
- :pencil : - updating docs
- :green_heart : - updating CI/CD configuration
- :white_check_mark : - updating/adding tests

<!-- E.g. https://github.com/opengovernment/opengovernment/blob/master/CONTRIBUTING.md or https://github.com/github/docs/blob/main/CONTRIBUTING.md -->
