// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { TBinutil } from "#lib/binutil/mod.ts"

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/command.ts"
import { bold, green, red, underline } from "#std/fmt/colors.ts"
import { Switch } from "#lib/switch/mod.ts"
import { main } from "./src/impl.ts"
import { ConsoleLogger } from "#lib/logger/mod.ts"

const opts = await new Command()
	.name("mklib")
	.version("0.1.0")
	.description(
		`The "mklib" command creates a new directory inside "lib" with the conventional file ` +
			`structure to make a new library.`
	)
	.option("-l, --license <mit|mpl>", "Licence for the generated code.", {
		default: "mit",
		value: v =>
			Switch.of(v)
				.case("mpl", () => "MPL-2.0")
				.default(() => "MIT"),
	})
	.arguments("<name>")
	.parse(Deno.args)

const name = opts.args[0].toLocaleLowerCase()
const license = opts.options.license

await main(name, license as TBinutil.License).fork(
	() => ConsoleLogger.error(`${red("✗")} ${underline(name)} already exists in ${bold("./lib")}.`),
	() => ConsoleLogger.notice(`${green("✓")} ${underline(name)} created!`)
)
