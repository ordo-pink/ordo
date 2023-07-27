// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/command.ts"
import { test } from "./src/impl.ts"

const opts = await new Command()
	.name("test")
	.version("0.1.0")
	.description(`The "test" command runs tests found deeply nested in directories in the project.`)
	.option("--coverage", "Enable collecting coverage")
	.parse(Deno.args)

await test(opts.options.coverage).toPromise()
