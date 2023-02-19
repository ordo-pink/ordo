# Ordo Monorepo

[![CI](https://github.com/ordo-pink/ordo/actions/workflows/ci.yml/badge.svg)](https://github.com/ordo-pink/ordo/actions/workflows/ci.yml)

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.carloscuesta.me/)
[![nx](https://img.shields.io/badge/generated%20with-nx-blue)](https://nx.dev)
[![license](https://img.shields.io/github/license/ordo-pink/ordo)](https://github.com/ordo-pink/ordo)

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Start it

```sh
npm i
```

```sh
# Spins up a local backend server that stores data in FS as well as a frontend
# server, and instructs the frontend to send requests there.
npm start
```

or

```sh
# Spins up a frontend server, and instructs it to send requests to the remote
# api-test server. You need to gain access to the remote api-test server before
# you can start using it. If you don't have the credentials, please reach out
# to the Ordo.pink support.
npm run start:remote
```

## Generating libs

### Node.js

```sh
npx nx g @nrwl/node:lib NAME [--publishabe --importPath=[@ordo-pink/]NAME]
```

### Common

```sh
npx nx g @nrwl/js:lib NAME --bundler=vite --unitTestRunner=vitest [--publishable --importPath=[@ordo-pink/]NAME]
```
