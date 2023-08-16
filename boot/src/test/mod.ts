// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { test } from "./src/impl"

const program = new Command()

program
	.name("test")
	.version("0.2.0")
	.description("Run tests with 'bun test' all over the monorepo.")
	.option("-c, --coverage", "collect coverage")
	.action(test)

program.parse()
