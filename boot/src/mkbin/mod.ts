// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { green, red, underline } from "#std/fmt/colors.ts"
import { getAbsolutePath } from "#lib/fs/mod.ts"
import { generateFile } from "#lib/binutil/mod.ts"
import { checkDirectoryExists } from "#lib/fs/src/impl.ts"

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
const path = getAbsolutePath(`boot/src/${name}`)

if (await checkDirectoryExists(path)) {
	console.error(`${red("✗")} Bin "${name}" already exists.`)
	Deno.exit(1)
}

const MOD_TEMPLATE = `// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"

const opts = await new Command()
	.name("${name}")
	.description("${name}")
	.version("0.1.0")
	.parse(Deno.args)

const main = () => {
	console.log(opts)
}

main()
`

const TEST_TEMPLATE = `import { assertEquals } from "#std/testing/asserts.ts"

Deno.test("${name} should pass", () => assertEquals(true, true))
`

await generateFile(`${path}/mod.ts`, MOD_TEMPLATE)
await generateFile(`${path}/mod.test.ts`, TEST_TEMPLATE)

console.log(`${green("✓")} ${underline(name)} created!`)
