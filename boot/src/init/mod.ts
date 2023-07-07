import { join } from "#std/path/mod.ts"
import { clib } from "#lib/clib/mod.ts"
import { iro } from "#lib/iro/mod.ts"

const opts = clib(Deno.args, {
	name: "init",
	description:
		`The "init" command inializes the repository by executing all the necessary ` +
		`steps to make it work properly. This includes compiling bin files, creating ` +
		`necessary symlinks, installing dependencies, and so on.`,
}).getOrElse(str => {
	console.log(str)
	Deno.exit()
})

export const main = async () => {
	const c = iro(opts.options.noColor)
	const encoder = new TextEncoder()

	const denoPath = join("opt", "deno")
	const sourcesPath = join(Deno.cwd(), "boot", "src")

	const sources = Deno.readDir(sourcesPath)

	for await (const source of sources) {
		if (!source.isDirectory || source.name === "init") continue

		const path = join(sourcesPath, source.name, "mod.ts")

		const command = new Deno.Command(denoPath, {
			args: [
				"compile",
				"--allow-read",
				"--allow-write",
				"--allow-run",
				`--output=bin/${source.name}`,
				path,
			],
			stdout: "piped",
			stderr: "piped",
		})

		Deno.stdout.write(
			encoder.encode(`${c.yellow("◌")} Complining ${source.name}... `)
		)

		try {
			const { code } = await command.output()

			Deno.stdout.write(encoder.encode(`${c.green("✓")}\n`))

			if (code !== 0) {
				Deno.stdout.write(encoder.encode(`${c.red("✗")}\n`))
			}
		} catch (e) {
			Deno.stdout.write(encoder.encode(`${c.red("✗")}\n`))
			console.log(e)
		}
	}

	const configPath = join(Deno.cwd(), "etc", "init")
	const configSources = Deno.readDir(configPath)

	for await (const source of configSources) {
		const path = join(configPath, source.name)

		const command = new Deno.Command("ln", {
			args: ["-nf", path, source.name],
			stdout: "piped",
			stderr: "piped",
		})

		Deno.stdout.write(
			encoder.encode(
				`${c.yellow("◌")} Creating hard link for ${source.name}... `
			)
		)

		try {
			const { code, stderr } = await command.output()

			if (code !== 0) {
				Deno.stdout.write(encoder.encode(`${c.red("✗")}\n`))
				Deno.stderr.write(stderr)
			} else {
				Deno.stdout.write(encoder.encode(`${c.green("✓")}\n`))
			}
		} catch (e) {
			Deno.stderr.write(encoder.encode(`${c.red("✗")}\n`))
			console.error(e)
		}
	}
}

await main()
