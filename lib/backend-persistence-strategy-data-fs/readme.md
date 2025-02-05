# FS Persistence Strategy for User Data

`ContentPersistenceStrategyFS` implements the `ContentPersistenceStrategy` interface in a way that enables file content
persistence as files using file system. It only relies on streams so read/write operations will not load the whole file into
memory.

## Warning

This persistence strategy is not recommended for production usage. It is fine to use it on a personal server with 3-5 people. It
is also a viable option for development purposes.

## Installation

```sh
bunx jsr add @ordo-pink/backend-persistence-strategy-data-fs @ordo-pink/oath @ordo-pink/tau @ordo-pink/core
```

## Usage

```typescript
import { PersistenceStrategyDataFS } from "@ordo-pink/backend-persistence-strategy-data-fs"

const contentPersistenceStrategy = ContentPersistenceStrategyFS.of("/var/ordo/files")

// Provide `data_persistence_strategy` to `create_backend_dt`. See more in "@ordo-pink/backend-dt".
```
