// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { join } from "#std/path/mod.ts"
import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { bold, green, red, underline } from "#std/fmt/colors.ts"

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
	.parse(Deno.args)

const name = opts.args[0].toLocaleLowerCase()

const encoder = new TextEncoder()

const parentPath = join(Deno.cwd(), "boot", "src", name)

const stat = await Deno.stat(parentPath).catch(() => null)

if (stat && stat.isDirectory) {
	console.error(
		`${red("✗")} ${underline(name)} already exists in ${bold("./boot/src/")}. Terminating.`
	)
	Deno.exit(1)
}

const filePath = join(parentPath, "mod.ts")
const testFilePath = join(parentPath, "mod.test.ts")

const fileContent = `import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"

const opts = await new Command()
	.name("${name}")
	.version("0.1.0")
	.parse(Deno.args)

console.log(opts)
`

const testFileContent = `import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("${name}", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})`

await Deno.mkdir(parentPath)
await Deno.writeFile(filePath, encoder.encode(fileContent + "\n"))
await Deno.writeFile(testFilePath, encoder.encode(testFileContent + "\n"))

console.log(`${green("✓")} ${underline(name)} created!`)
