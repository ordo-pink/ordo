import { join } from "#std/path/mod.ts"
import { clib } from "#lib/clib/mod.ts"
import { iro } from "#lib/iro/mod.ts"
import { titleize } from "#lib/tau/mod.ts"

/**
 * CLI opts for `bin/mklib`.
 */
const opts = clib(Deno.args, {
	name: "mklib",
	description:
		`The "mklib" command creates a new directory inside "lib" with the conventional file ` +
		`structure to make a new "lib".`,
	args: [{ name: "name", description: "Name of the bin executable." }],
}).getOrElse(str => {
	console.log(str)
	Deno.exit()
})

const name = opts.args.name
const c = iro(opts.options.color === "no")
const encoder = new TextEncoder()

const parentPath = join(Deno.cwd(), "lib", name)

const srcPath = join(Deno.cwd(), "lib", name, "src")

const stat = await Deno.stat(parentPath).catch(() => null)

if (stat && stat.isDirectory) {
	console.error(
		`${c.red("✗")} ${c.underline(name)} already exists in ${c.bold(
			"./lib"
		)}. Terminating.`
	)
	Deno.exit(1)
}

const implPath = join(srcPath, "impl.ts")
const typesPath = join(srcPath, "types.ts")
const testPath = join(srcPath, "impl.test.ts")
const modPath = join(parentPath, "mod.ts")
const readmePath = join(parentPath, "readme.md")

const implContent = `import type { ${titleize(name)} } from "./types.ts"

export const ${name}: ${titleize(name)} = "${name}"`

const typesContent = `export type ${titleize(name)} = "${name}"`

const testContent = `import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("${titleize(name)}", ({ test, todo }) => {
	test("should pass", ({ expect }) => expect().toPass())
})`

const modContent = `export * from "./src/impl.ts"
export * from "./src/types.ts"`

const readmeContent = `# ${titleize(name)}`

await Deno.mkdir(parentPath)
await Deno.mkdir(srcPath)

await Deno.writeFile(readmePath, encoder.encode(readmeContent + "\n"))
await Deno.writeFile(modPath, encoder.encode(modContent + "\n"))
await Deno.writeFile(typesPath, encoder.encode(typesContent + "\n"))
await Deno.writeFile(testPath, encoder.encode(testContent + "\n"))
await Deno.writeFile(implPath, encoder.encode(implContent + "\n"))

console.log(`${c.green("✓")} ${c.underline(name)} created!`)
