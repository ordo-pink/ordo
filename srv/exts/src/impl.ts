// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { serveDir } from "#std/http/file_server.ts"
import { getc } from "#lib/getc/mod.ts"

const { EXTS_EXTENSIONS_ROOT, EXTS_PORT } = getc(["EXTS_EXTENSIONS_ROOT", "EXTS_PORT"])

Deno.serve({ port: Number(EXTS_PORT) }, (req: Request) => {
	return serveDir(req, {
		fsRoot: EXTS_EXTENSIONS_ROOT,
	})
})
