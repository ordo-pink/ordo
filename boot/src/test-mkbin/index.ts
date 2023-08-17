// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { testMkbin } from "./src/impl"

const program = new Command()

program
	.name("test-mkbin")
	.version("0.1.0")
	.description("test-mkbin description.")
	.action(() => {
		testMkbin()
	})

program.parse()
