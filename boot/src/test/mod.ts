// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/command.ts"
import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"

await new Command()
	.name("test")
	.version("0.1.0")
	.description(
		`The "test" command runs tests found deeply nested in directories ` +
			`provided as arguments. Using "bin/test ." will find and run all tests ` +
			`in the repository.`
	)
	.parse(Deno.args)

const denoPath = getDenoPath()
await runDenoCommand(denoPath, ["test", "--coverage=./var/coverage", "--parallel", Deno.cwd()])
