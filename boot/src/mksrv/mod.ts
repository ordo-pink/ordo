import { join } from "#std/path/mod.ts"
import { clib } from "#lib/clib/mod.ts"
import { iro } from "#lib/iro/mod.ts"
import { titleize } from "#lib/tau/mod.ts"
import { isReservedJavaScriptKeyword } from "#lib/rkwjs/mod.ts"

/**
 * CLI opts for `bin/mksrv`.
 */
const opts = clib(Deno.args, {
	name: "mksrv",
	description:
		`The "mksrv" command creates a new directory inside "srv" with the conventional file ` +
		`structure to make a new application.`,
	args: [{ name: "name", description: "Name of the application." }],
}).getOrElse(str => {
	console.log(str)
	Deno.exit()
})

const name = opts.args.name

const codeName = isReservedJavaScriptKeyword(opts.args.name as unknown)
	? `${opts.args.name}Srv`
	: opts.args.name

const c = iro(opts.options.color === "no")
const encoder = new TextEncoder()

const srvPath = join(Deno.cwd(), "srv")
const parentPath = join(srvPath, name as string)
const srcPath = join(parentPath, "src")

const stat = await Deno.stat(parentPath).catch(() => null)

if (stat && stat.isDirectory) {
	console.error(
		`${c.red("✗")} ${c.underline(name as string)} already exists in ${c.bold(
			"./srv"
		)}. Terminating.`
	)
	Deno.exit(1)
}

const implPath = join(srcPath, "impl.ts")
const typesPath = join(srcPath, "types.ts")
const testPath = join(srcPath, "impl.test.ts")
const modPath = join(parentPath, "mod.ts")
const readmePath = join(parentPath, "readme.md")

const implContent = `import type { ${titleize(
	codeName as string
)} } from "./types.ts"

export const ${codeName as string}: ${titleize(codeName as string)} = "${
	codeName as string
}"`

const typesContent = `export type ${titleize(codeName as string)} = "${
	codeName as string
}"`

const testContent = `import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("${name as string}", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})`

const modContent = `export * from "./src/impl.ts"
export * from "./src/types.ts"`

const readmeContent = `# ${titleize(name as string)}`

if (!(await Deno.stat(srvPath).catch(() => null))) {
	await Deno.mkdir(srvPath)
}

await Deno.mkdir(parentPath)
await Deno.mkdir(srcPath)

await Deno.writeFile(readmePath, encoder.encode(readmeContent + "\n"))
await Deno.writeFile(modPath, encoder.encode(modContent + "\n"))
await Deno.writeFile(typesPath, encoder.encode(typesContent + "\n"))
await Deno.writeFile(testPath, encoder.encode(testContent + "\n"))
await Deno.writeFile(implPath, encoder.encode(implContent + "\n"))

console.log(`${c.green("✓")} ${c.underline(name as string)} created!`)
