// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "commander"
import { mklib } from "./src/impl"

const program = new Command()

program
	.name("mklib")
	.version("0.2.0")
	.description(
		"The 'mklib' command creates a new directory inside 'lib' with the conventional file " +
			"structure to make a new library.",
	)
	.argument("name", "name of the lib to be created")
	.option("-u, --unlicense", "use The Unlicense instead of GNU AGPL 3.")
	.action(async (name, options) => {
		const license = options.license ? "Unlicense" : "AGPL-3.0-only"

		await mklib(name, license)
	})

program.parse()
