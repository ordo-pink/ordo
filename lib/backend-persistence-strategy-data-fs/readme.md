# Data persistence strategy FS

`DataPersistenceStrategyFS` implements the `DataPersistenceStrategy` interface in a way that enables
data persistence as files using file system. It only relies on streams so read/write operations will
not load the whole file into memory.

## Warning

This persistence strategy is not recommended for production usage. It is fine to use it on a
personal server with 3-5 people. It is also a viable option for development purposes.

## Usage

```typescript
import { createDataServer } from "@ordo-pink/backend-server-data"
import { DataPersistenceStrategyFS } from "@ordo-pink/backend-data-persistence-strategy-fs"

const root = "/var/ordo/data" // Path to where you want your files to be stored
const dataPersistenceStrategy = DataPersistenceStrategyFS.of({ root })

const dataServer = createData({ dataPersistenceStrategy /* ...other things */ })
```
