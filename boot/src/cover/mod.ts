// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { identity } from "#lib/tau/mod.ts"
import { main } from "./src/impl.ts"
import { ConsoleLogger } from "#lib/logger/mod.ts"

const opts = await new Command()
	.name("cover")
	.version("0.1.0")
	.description(
		`Coverage command executes tests and collects test coverage reports. It generates a set of ` +
			`JSON files with "deno test --coverage", then creates a lcov profile. The result ` +
			`of collecting coverage reports is saved to "./var/coverage".`
	)
	.option("--no-lcov", "Disable generating LCOV report.")
	.parse(Deno.args)

await main(opts.options).fork(identity, () =>
	ConsoleLogger.notice(
		`🎉 Done! To generate an HTML version of the report, run ` +
			`"genhtml -o var/coverage/profile/html var/coverage/profile.lcov". ` +
			`NOTE: this command requires "lcov" to be installed on your system.`
	)
)
