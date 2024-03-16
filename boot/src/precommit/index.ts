// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "commander"
import { precommit } from "./src/impl"

const program = new Command()

program
	.name("precommit")
	.version("0.1.0")
	.description("Precommit hook for ordo repo. Super-opinionated.")
	.action(precommit)

program.parse()
