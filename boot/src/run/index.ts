// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { run } from "./src/impl"

const program = new Command()

program
	.name("run")
	.version("0.2.0")
	.description("Run all server applications at once by executing their bin/run.ts scripts.")
	.action(run)

program.parse()
