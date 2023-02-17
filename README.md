# Ordo Monorepo

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.carloscuesta.me/)
[![nx](https://img.shields.io/badge/generated%20with-nx-blue)](https://nx.dev)
[![license](https://img.shields.io/github/license/ordo-pink/ordo)](https://github.com/ordo-pink/ordo)

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Generating libs

### Node.js

```sh
npx nx g @nrwl/node:lib NAME [--publishabe --importPath=[@ordo-pink/]NAME]
```

### Common

```sh
npx nx g @nrwl/js:lib NAME --bundler=vite --unitTestRunner=vitest [--publishable --importPath=[@ordo-pink/]NAME]
```
