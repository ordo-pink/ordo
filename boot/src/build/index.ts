// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { build } from "./src/build.impl"

const program = new Command()

program
	.name("build")
	.version("0.1.0")
	.description("Build srvs for deployment.")
	.action(() => {
		build()
	})

program.parse()
