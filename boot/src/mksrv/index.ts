// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "commander"
import { mksrv } from "./src/impl"

const program = new Command()

program
	.name("mksrv")
	.version("0.2.0")
	.description(
		"The 'mksrv' command creates a new directory inside 'srv' with the conventional file " +
			"structure to make a new server application.",
	)
	.argument("name", "name of the srv to be created")
	.option("-u, --unlicense", "use The Unlicense instead of GNU AGPL 3.")
	.action(async (name, options) => {
		const license = options.license ? "Unlicense" : "AGPL-3.0-only"

		await mksrv(name, license)
	})

program.parse()
