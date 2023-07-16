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

const implContent = `import { getc } from "#lib/getc/mod.ts"

// Define the type for the srv configuration
type Config = {}

// This is the merge of configuration in /etc/srv/${name}.json and
// /usr/srv/${name}.json. USR content overrides ETC content. ETC content is
// published to git remote whereas USR content is gitignored and available
// locally. Share config for initial app startup in ETC and tune it for your
// own needs in USR.
const config = await getc<Config>("${name}")

const main = () => {
	// Your awesome app here
}

await main()`

const testContent = `import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("${name as string}", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})`

const modContent = `export * from "./src/impl.ts"`

const binInitContent = `import { join } from "#std/path/mod.ts"
import { cyan, green } from "#std/fmt/colors.ts"

// Put the configuration for you srv here
// It will be generated on "bin/init" and regenerated on "bin/reinit"
const defaultConfig = {}

const generateDefaultConfiguration = async () => {
	const encoder = new TextEncoder()

	const etcParentPath = join(Deno.cwd(), "etc", "srv")
	const usrParentPath = join(Deno.cwd(), "usr", "srv")
	const etcPath = join(etcParentPath, "${name}.json")
	const usrPath = join(usrParentPath, "${name}.json")

	const etcParentExists = await Deno.stat(etcParentPath).catch(() => null)
	const usrParentExists = await Deno.stat(usrParentPath).catch(() => null)
	const etcExists = await Deno.stat(etcPath).catch(() => null)
	const usrExists = await Deno.stat(usrPath).catch(() => null)

	if (!etcParentExists) await Deno.mkdir(etcParentPath, { recursive: true })
	if (!usrParentExists) await Deno.mkdir(usrParentPath, { recursive: true })

	if (!etcExists)
		await Deno.writeFile(
			etcPath,
			encoder.encode(JSON.stringify(defaultConfig, null, 2))
		)
	if (!usrExists)
		await Deno.writeFile(
			usrPath,
			encoder.encode(JSON.stringify(defaultConfig, null, 2))
		)
}

const main = async () => {
	const encoder = new TextEncoder()

	Deno.stdout.write(
		encoder.encode(
			\`  \${cyan("→")} Generating configuration files in /etc/ and /usr/ ...\`
		)
	)

	await generateDefaultConfiguration()

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
