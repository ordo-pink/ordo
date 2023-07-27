// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { identity } from "#lib/tau/mod.ts"
import { init } from "./src/impl.ts"
import { ConsoleLogger } from "#lib/logger/mod.ts"

await new Command()
	.name("init")
	.version("0.1.0")
	.description(
		`The "init" command inializes the repository by executing all the necessary ` +
			`steps to make it work properly. This includes compiling bin files, creating ` +
			`necessary symlinks, installing dependencies, and so on.`
	)
	.parse(Deno.args)

await init().fork(identity, () =>
	ConsoleLogger.notice(
		"🎉 Initialization done! Use `bin/$COMMAND -h` to get familiar with repo commands."
	)
)
