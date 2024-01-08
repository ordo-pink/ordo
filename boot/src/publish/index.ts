// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { publish } from "./src/publish.impl"

const program = new Command()

program
	.name("publish")
	.version("0.1.0")
	.description("Build and publish srvs.")
	.action(() => {
		publish()
	})

program.parse()
