// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { join } from "#std/path/mod.ts"
import { blue, green, red, setColorEnabled } from "#std/fmt/colors.ts"

const decoder = new TextDecoder()
const encoder = new TextEncoder()

const command = await new Command()
	.name("init")
	.version("0.1.0")
	.description(
		`The "init" command inializes the repository by executing all the necessary ` +
			`steps to make it work properly. This includes compiling bin files, creating ` +
			`necessary symlinks, installing dependencies, and so on.`
	)
	.option("--silent", "Disable output")
	.option("--no-color", "Disable color output")
	.parse(Deno.args)

export const main = async () => {
	setColorEnabled(command.options.color)

	const err = command.options.silent
		? () => void 0
		: (message: string) => Deno.stdout.write(encoder.encode(message))

	const log = command.options.silent
		? () => void 0
		: (message: string) => Deno.stderr.write(encoder.encode(message))

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

		log(`${blue("→")} Complining ${source.name}... `)

		try {
			await command.output()
			log(green("✓"))
			log("\n")
		} catch (e) {
			log(red("✗"))
			log("\n")
			err(e)
		}
	}

	const configPath = join(Deno.cwd(), "etc", "init")
	const configSources = Deno.readDir(configPath)

	for await (const source of configSources) {
		const path = join(configPath, source.name)

		const command = new Deno.Command("ln", {
			args: ["-snf", path, source.name],
			stdout: "piped",
			stderr: "piped",
		})

		log(`${blue("→")} Creating soft link for ${source.name}... `)

		try {
			const { code, stderr } = await command.output()

			if (code !== 0) {
				log(red("✗"))
				log("\n")
				err(decoder.decode(stderr))
			}

			log(green("✓"))
			log("\n")
		} catch (e) {
			log(red("✗"))
			log("\n")
			err(e)
		}
	}

	const srvsPath = join(Deno.cwd(), "srv")
	const srvs = Deno.readDir(srvsPath)

	for await (const srv of srvs) {
		if (!srv.isDirectory) continue

		const path = join(srvsPath, srv.name, "bin", "init.ts")

		const exists = await Deno.stat(path).catch(() => false)

		if (!exists) continue

		const command = new Deno.Command(denoPath, {
			args: ["run", "--allow-read", "--allow-write", "--allow-run", "--allow-env", path],
			stdout: "piped",
			stderr: "piped",
		})

		log(`${blue("→")} Executing srv/${srv.name}/bin/init.ts... `)

		try {
			const { code, stdout, stderr } = await command.output()
			const messages = decoder.decode(stdout).split("\n")
			messages.filter(Boolean).forEach(message => {
				log("\n")
				log(message)
			})

			if (code !== 0) {
				log(red("✗"))
				log("\n")
				err(decoder.decode(stderr))
			}

			log("\n")
		} catch (e) {
			log(red("✗"))
			log("\n")
			err(e)
		}
	}

	log("🎉 All done!")
	log("\n")
}

await main()
