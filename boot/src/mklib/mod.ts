// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { join } from "#std/path/mod.ts"
import { titleCase, pascalCase } from "#x/case@2.1.1/mod.ts"
import { isReservedJavaScriptKeyword } from "#lib/rkwjs/mod.ts"
import { Command } from "#x/cliffy@v1.0.0-rc.2/command/command.ts"
import { bold, green, red, underline } from "#std/fmt/colors.ts"

const opts = await new Command()
	.name("mkbin")
	.version("0.1.0")
	.description(
		`The "mklib" command creates a new directory inside "lib" with the conventional file ` +
			`structure to make a new library.`
	)
	.arguments("<name>")
	.parse(Deno.args)

const name = opts.args[0].toLocaleLowerCase()
const codeName = isReservedJavaScriptKeyword(name) ? `${name}Lib` : name
const encoder = new TextEncoder()

const libPath = join(Deno.cwd(), "lib")
const parentPath = join(libPath, name)
const srcPath = join(parentPath, "src")

const stat = await Deno.stat(parentPath).catch(() => null)

if (stat && stat.isDirectory) {
	console.error(`${red("✗")} ${underline(name)} already exists in ${bold("./lib")}. Terminating.`)
	Deno.exit(1)
}

const implPath = join(srcPath, "impl.ts")
const typesPath = join(srcPath, "types.ts")
const testPath = join(srcPath, "impl.test.ts")
const modPath = join(parentPath, "mod.ts")
const readmePath = join(parentPath, "readme.md")

const implContent = `import type { ${pascalCase(codeName)} } from "./types.ts"

export const ${codeName}: ${pascalCase(codeName)} = "${codeName}"`

const typesContent = `export type ${pascalCase(codeName)} = "${codeName}"`

const testContent = `import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("${name}", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})`

const modContent = `export * from "./src/impl.ts"
export * as T from "./src/types.ts"`

const readmeContent = `# ${titleCase(name)}`

if (!(await Deno.stat(libPath).catch(() => null))) {
	await Deno.mkdir(libPath)
}

await Deno.mkdir(parentPath)
await Deno.mkdir(srcPath)

await Deno.writeFile(readmePath, encoder.encode(readmeContent + "\n"))
await Deno.writeFile(modPath, encoder.encode(modContent + "\n"))
await Deno.writeFile(typesPath, encoder.encode(typesContent + "\n"))
await Deno.writeFile(testPath, encoder.encode(testContent + "\n"))
await Deno.writeFile(implPath, encoder.encode(implContent + "\n"))

console.log(`${green("✓")} ${underline(name)} created!`)
