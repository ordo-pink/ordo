/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts"
import manifest from "./fresh.gen.ts"

// TODO: Add a bin for starting tailwind in parallel
// TODO: Add a script for copying
// TODO: Move staticDir to dotenv
await start(manifest, { staticDir: "../../var/srv/web/static" })
