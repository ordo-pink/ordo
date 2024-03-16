// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "commander"

import { compile } from "./src/build.impl"

const program = new Command()

program
	.name("compile")
	.version("0.1.0")
	.description("Build srvs that have a bin/build.ts instruction.")
	.action(compile)

program.parse()
