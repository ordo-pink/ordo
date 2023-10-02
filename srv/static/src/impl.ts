// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { prop } from "ramda"
import { join } from "path"
import { ConsoleLogger } from "@ordo-pink/logger"
import { fileExists0 } from "@ordo-pink/fs"
import { getc } from "@ordo-pink/getc"
import { Oath } from "@ordo-pink/oath"

const { STATIC_ROOT, STATIC_PORT } = getc(["STATIC_ROOT", "STATIC_PORT"])

Bun.serve({
	port: Number(STATIC_PORT),
	fetch: req =>
		Oath.of(new URL(req.url))
			.map(prop("pathname"))
			.map(pathname => join(STATIC_ROOT, pathname))
			.chain(path =>
				fileExists0(path).chain(exists =>
					Oath.fromBoolean(
						() => exists,
						() => Bun.file(path),
						() => null,
					),
				),
			)
			.fork(
				() => new Response("Not found", { status: 404 }),
				file => new Response(file),
			),
})

ConsoleLogger.info(`STATIC server running on http://localhost:${STATIC_PORT}`)
