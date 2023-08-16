// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { License } from "#lib/binutil/mod.ts"

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { green, red, underline } from "#std/fmt/colors.ts"
import { Switch } from "#lib/switch/mod.ts"
import { mkbin } from "./src/impl.ts"
import { ConsoleLogger } from "#lib/logger/mod.ts"

const opts = await new Command()
	.name("mkbin")
	.version("0.1.0")
	.description(
		`The "mkbin" command creates a new directory inside "boot/src" with the conventional ` +
			`file structure to start a new "bin". Bins are the executable CLI tools that provide ` +
			`improved developer experience within the repository without hiding the complexity ` +
			`of what is actually happening under the hood.`
	)
	.arguments("<name>")
	.option("-l, --license <mit|mpl>", "Licence for the generated code.", {
		default: "mit",
		value: v =>
			Switch.of(v)
				.case("mpl", () => "MPL-2.0")
				.default(() => "MIT"),
	})
	.parse(Deno.args)

const name = opts.args[0].toLocaleLowerCase()
const license = opts.options.license

await mkbin(name, license as License).fork(
	() => ConsoleLogger.error(`${red("✗")} Bin "${name}" already exists.`),
	() => ConsoleLogger.notice(`${green("✓")} ${underline(name)} created!`)
)
