import "#std/dotenv/load.ts"

import { Oath } from "#lib/oath/mod.ts"
import { createDirectoryIfNotExists, getParentPath } from "#lib/fs/mod.ts"

await Oath.fromNullable(Deno.env.get("ID_KV_DB_PATH"))
	.map(getParentPath)
	.chain(createDirectoryIfNotExists)
	.toPromise()
