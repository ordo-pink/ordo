# Content persistence strategy FS

`ContentPersistenceStrategyFS` implements the `ContentPersistenceStrategy` interface in a way that
enables file content persistence as files using file system. It only relies on streams so read/write
operations will not load the whole file into memory.

## Warning

This persistence strategy is not recommended for production usage. It is fine to use it on a
personal server with 3-5 people. It is also a viable option for development purposes.

## Usage

```typescript
import { createDataServer } from "@ordo-pink/backend-server-data"
import { ContentPersistenceStrategyFS } from "@ordo-pink/backend-content-persistence-strategy-fs"

const root = "/var/ordo/content" // Path to where you want your files to be stored
const contentPersistenceStrategy = ContentPersistenceStrategyFS.of({ root })

const dataServer = createData({ contentPersistenceStrategy /* ...other things */ })
```
