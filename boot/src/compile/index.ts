// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { compile } from "./src/compile.impl"

const program = new Command()

program
	.name("compile")
	.version("0.1.0")
	.description("Compile srvs that have a bin/compile.ts instruction.")
	.action(() => {
		compile()
	})

program.parse()
