# authorisation-stub

[![nx](https://img.shields.io/badge/generated%20with-nx-blue)](https://nx.dev)

## About

Authorisation stub is an authorisation middleware for `@ordo-pink/backend-universal`. It allows you
to use the backend as if you were authenticated with the token you define for the stub.

## Usage

To make it work, simply provide it as an authorise function to the Backend Universal server factory.

```typescript
import { authorisationStub } from "@ordo-pink/backend-authorisation-stub"

const myAuthToken = process.env.AUTH_TOKEN || "WHOA_NOT_SO_SAFE!"

const authorise = authorisationStub(myAuthToken)

// Pass to Backend Universal server factory
```

Now you can sign your requests with `Authorization` header with the value `Bearer ${myAuthToken}` to
make Backend Universal work.

## ⚠ **WARNING** ⚠

Don't use it in production. It should only be used for testing, debugging, or local development
purposes.

## Installation

```sh
npm i -S @ordo-pink/backend-authorisation-stub
```
