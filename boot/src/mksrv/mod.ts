// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { join } from "#std/path/mod.ts"
import { titleCase } from "#x/case@2.1.1/mod.ts"
import { Command } from "#x/cliffy@v1.0.0-rc.2/command/command.ts"
import { bold, green, red, underline } from "#std/fmt/colors.ts"

// TODO: Add run scripts and run command

const opts = await new Command()
	.name("mkbin")
	.version("0.1.0")
	.description(
		`The "mksrv" command creates a new directory inside "srv" with the conventional file ` +
			`structure to make a new application.`
	)
	.arguments("<name>")
	.parse(Deno.args)

const name = opts.args[0].toLocaleLowerCase()

const encoder = new TextEncoder()

const srvPath = join(Deno.cwd(), "srv")
const parentPath = join(srvPath, name)
const srcPath = join(parentPath, "src")
const binPath = join(parentPath, "bin")

const stat = await Deno.stat(parentPath).catch(() => null)

if (stat && stat.isDirectory) {
	console.error(`${red("✗")} ${underline(name)} already exists in ${bold("/srv")}. Terminating.`)
	Deno.exit(1)
}

const implPath = join(srcPath, "impl.ts")
const testPath = join(srcPath, "impl.test.ts")
const modPath = join(parentPath, "mod.ts")
const binInitPath = join(binPath, "init.ts")
const readmePath = join(parentPath, "readme.md")

const implContent = `// SPDX-FileCopyrightText: Copyright ${new Date(
	Date.now()
).getFullYear()}, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

const main = () => {
	console.log("Hello, world!")
}

await main()`

const testContent = `import { assertEquals } from "#std/testing/asserts.ts"

Deno.test("mock", () => assertEquals(true, true))`

const modContent = `// SPDX-FileCopyrightText: Copyright ${new Date(
	Date.now()
).getFullYear()}, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

export * from "./src/impl.ts"`

const binInitContent = `// SPDX-FileCopyrightText: Copyright ${new Date(
	Date.now()
).getFullYear()}, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// Put first launch automation tasks here
const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(encoder.encode(\`  \${cyan("→")} Doing nothing...\`))
	Deno.stdout.write(encoder.encode(\` \${green("✓")}\n\`))
}

await main()`

const readmeContent = `# ${titleCase(name)}`

if (!(await Deno.stat(srvPath).catch(() => null))) {
	await Deno.mkdir(srvPath)
}

await Deno.mkdir(parentPath)
await Deno.mkdir(srcPath)
await Deno.mkdir(binPath)

await Deno.writeFile(readmePath, encoder.encode(readmeContent + "\n"))
await Deno.writeFile(modPath, encoder.encode(modContent + "\n"))
await Deno.writeFile(testPath, encoder.encode(testContent + "\n"))
await Deno.writeFile(implPath, encoder.encode(implContent + "\n"))
await Deno.writeFile(binInitPath, encoder.encode(binInitContent + "\n"))

console.log(`${green("✓")} ${underline(name)} created!`)
