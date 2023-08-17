// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Command } from "commander"
import { Switch } from "@ordo-pink/switch"
import { mkf } from "./src/impl"

const program = new Command()

program
	.name("mkf")
	.version("0.1.0")
	.description(
		"Create a TypeScript file in given lib, srv or bin with given path. This command " +
			"automatically detects the license type of the space it is used in. Creates parent " +
			"directories if they do not exist."
	)
	.argument(
		"space",
		"place where the file should be created (lib/$DIR, boot/src/$DIR, or srv/$DIR)"
	)
	.argument("path", "path to the file to be created")
	.option("-t, --create-test", "generate test")
	.option("-e, --file-extension <ts|tsx>", "extension of the generated file", "ts")
	.action(async (space, path, options) => {
		const fileExtension = Switch.of(options.fileExtension)
			.case("tsx", () => "tsx" as const)
			.default(() => "ts" as const)

		await mkf({ space, path, fileExtension, createTest: options.createTest })
	})

program.parse()
