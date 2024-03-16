// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { Switch } from "@ordo-pink/switch"
import { mkbin } from "./src/impl"

const program = new Command()

program
	.name("mkbin")
	.version("0.2.0")
	.description(
		`The "mkbin" command creates a new directory inside "boot/src" with the conventional ` +
			`file structure to start a new "bin". Bins are the executable CLI tools that provide ` +
			`improved developer experience within the repository without hiding the complexity ` +
			`of what is actually happening under the hood.`,
	)
	.argument("name", "name of the bin to be created")
	.option("-l, --license <mit|mpl>", "license for the generated code", "mit")
	.action(async (name, options) => {
<<<<<<< Updated upstream
		const license = Switch.of(options.license)
			.case("mpl", () => "MPL-2.0" as const)
			.default(() => "MIT" as const)
=======
		const license = options.unlicense ? "Unlicense" : "AGPL-3.0-only"
>>>>>>> Stashed changes

		await mkbin(name, license)
	})

program.parse()
