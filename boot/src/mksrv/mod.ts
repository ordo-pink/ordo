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
const binPath = join(parentPath, "bin")

const stat = await Deno.stat(parentPath).catch(() => null)

if (stat && stat.isDirectory) {
	console.error(
		`${c.red("✗")} ${c.underline(name as string)} already exists in ${c.bold(
			"/srv"
		)}. Terminating.`
	)
	Deno.exit(1)
}

const implPath = join(srcPath, "impl.ts")
const testPath = join(srcPath, "impl.test.ts")
const modPath = join(parentPath, "mod.ts")
const binInitPath = join(binPath, "init.ts")
const readmePath = join(parentPath, "readme.md")

const implContent = `const main = () => {
	console.log("Hello, world!")
}

await main()`

const testContent = `import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("${name as string}", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})`

const modContent = `export * from "./src/impl.ts"`

const binInitContent = `// Put first launch automation tasks here
const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(encoder.encode(\`  \${cyan("→")} Doing nothing...\`))
	Deno.stdout.write(encoder.encode(\` \${green("✓")}\n\`))
}

await main()`

const readmeContent = `# ${titleize(name as string)}`

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

console.log(
	`${c.green("✓")} ${c.underline(
		name as string
	)} created! Don't forget to run "bin/init" to generate config files.`
)
