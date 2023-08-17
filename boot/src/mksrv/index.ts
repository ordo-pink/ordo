// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { Switch } from "@ordo-pink/switch"
import { mksrv } from "./src/impl"

const program = new Command()

program
	.name("mksrv")
	.version("0.2.0")
	.description(
		`The "mksrv" command creates a new directory inside "srv" with the conventional file ` +
			`structure to make a new server application.`
	)
	.argument("name", "name of the srv to be created")
	.option("-l, --license <mit|mpl>", "license for the generated code", "mit")
	.action(async (name, options) => {
		const license = Switch.of(options.license)
			.case("mpl", () => "MPL-2.0" as const)
			.default(() => "MIT" as const)

		await mksrv(name, license)
	})

program.parse()
