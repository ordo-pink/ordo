import { join } from "#std/path/mod.ts"
import { cyan, green } from "#std/fmt/colors.ts"

// Put the configuration for you srv here
// It will be generated on "bin/init" and regenerated on "bin/reinit"
const defaultConfig = {
	idHost: "http://localhost:3001",
}

const generateDefaultConfiguration = async () => {
	const encoder = new TextEncoder()

	const etcParentPath = join(Deno.cwd(), "etc", "srv")
	const usrParentPath = join(Deno.cwd(), "usr", "srv")
	const etcPath = join(etcParentPath, "web.json")
	const usrPath = join(usrParentPath, "web.json")

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
			`  ${cyan("→")} Generating configuration files in /etc/ and /usr/ ...`
		)
	)

	await generateDefaultConfiguration()

	Deno.stdout.write(
		encoder.encode(` ${green("✓")}
`)
	)
}

await main()
