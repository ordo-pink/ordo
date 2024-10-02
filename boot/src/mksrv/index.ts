// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

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
	.option("-l, --license <mit|mpl>", "license for the generated code", "mit")
	.action(async (name, options) => {
		const license = options.unlicense ? "Unlicense" : "AGPL-3.0-only"

		await mksrv(name, license)
	})

program.parse()
