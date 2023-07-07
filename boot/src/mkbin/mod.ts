import { join } from "#std/path/mod.ts"
import { clib } from "#lib/clib/mod.ts"
import { iro } from "#lib/iro/mod.ts"
import { titleize } from "#lib/tau/mod.ts"

/**
 * CLI opts for `bin/mkbin`.
 */
const opts = clib(Deno.args, {
	name: "mkbin",
	description:
		`The "mkbin" command creates a new directory inside "boot/src" with the conventional ` +
		`file structure to start a new "bin". Bins are the executable CLI tools that provide ` +
		`improved developer experience within the repository without hiding the complexity ` +
		`of what is actually happening under the hood.`,
	args: [{ name: "name", description: "Name of the bin executable." }],
}).getOrElse(str => {
	console.log(str)
	Deno.exit()
})

const name = opts.args.name
const c = iro(opts.options.color === "no")
const encoder = new TextEncoder()

const parentPath = join(Deno.cwd(), "boot", "src", name)

const stat = await Deno.stat(parentPath).catch(() => null)

if (stat && stat.isDirectory) {
	console.error(
		`${c.red("✗")} ${c.underline(name)} already exists in ${c.bold(
			"./boot/src/"
		)}. Terminating.`
	)
	Deno.exit(1)
}

const filePath = join(parentPath, "mod.ts")
const testFilePath = join(parentPath, "mod.test.ts")

const fileContent = `export const ${name} = "${name}"`
const testFileContent = `import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("${titleize(name)}", ({ test, todo }) => {
	test("should pass", ({ expect }) => expect().toPass())
})`

await Deno.mkdir(parentPath)
await Deno.writeFile(filePath, encoder.encode(fileContent + "\n"))
await Deno.writeFile(testFilePath, encoder.encode(testFileContent + "\n"))

console.log(`${c.green("✓")} ${c.underline(name)} created!`)
