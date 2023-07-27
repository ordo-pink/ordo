// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { run } from "./src/impl.ts"

const opts = await new Command()
	.name("run")
	.description("Starts all srvs at once.")
	.version("0.1.0")
	.parse(Deno.args)

await run().toPromise()
