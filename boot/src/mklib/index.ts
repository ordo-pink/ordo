// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { Switch } from "@ordo-pink/switch"
import { mklib } from "./src/impl"

const program = new Command()

program
	.name("mklib")
	.version("0.2.0")
	.description(
		`The "mklib" command creates a new directory inside "lib" with the conventional file ` +
			`structure to make a new library.`,
	)
	.argument("name", "name of the lib to be created")
	.option("-l, --license <mit|mpl>", "license for the generated code", "mit")
	.action(async (name, options) => {
<<<<<<< Updated upstream
		const license = Switch.of(options.license)
			.case("mpl", () => "MPL-2.0" as const)
			.default(() => "MIT" as const)
=======
		const license = options.unlicense ? "Unlicense" : "AGPL-3.0-only"
>>>>>>> Stashed changes

		await mklib(name, license)
	})

program.parse()
