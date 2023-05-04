# Backend FS Driver

[![CI](https://github.com/ordo-pink/ordo/actions/workflows/ci.yml/badge.svg)](https://github.com/ordo-pink/ordo/actions/workflows/ci.yml)

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.carloscuesta.me/)
[![nx](https://img.shields.io/badge/generated%20with-nx-blue)](https://nx.dev)
[![license](https://img.shields.io/github/license/ordo-pink/ordo)](https://github.com/ordo-pink/ordo)

This is the FS driver for Ordo backend server. It stores user data in files on the host machine. To
make it work, you need to provide absolute path to where the FS driver should store the data. It
will automatically create a directory for the authenticated user `sub` if it does not exist. This
directory is considered the root directory of the user.

## Examples

```typescript
import { join } from "path"
import { createFSDriver } from "@ordo-pink/backend-fs-driver"

const rootPath = join(__dirname, "..", "ordo-files")

const fsDriver = createFSDriver(rootPath)

fsDriver.checkFileExists("/1/2/3").then(console.log).catch(console.error)
```
