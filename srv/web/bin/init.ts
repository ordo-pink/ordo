// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import "#std/dotenv/load.ts"

import { Oath } from "#lib/oath/mod.ts"
import { createDirectoryIfNotExists, getParentPath } from "#lib/fs/mod.ts"

await Oath.fromNullable(Deno.env.get("ID_KV_DB_PATH"))
	.map(getParentPath)
	.chain(createDirectoryIfNotExists)
	.toPromise()
