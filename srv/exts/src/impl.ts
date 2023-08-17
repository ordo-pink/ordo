// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { serveDir } from "#std/http/file_server.ts"
import { getc } from "@ordo-pink/getc/mod.ts"

const { STATIC_ROOT, STATIC_PORT } = getc(["STATIC_ROOT", "STATIC_PORT"])

Deno.serve({ port: Number(STATIC_PORT) }, (req: Request) => {
	return serveDir(req, {
		fsRoot: STATIC_ROOT,
	})
})
