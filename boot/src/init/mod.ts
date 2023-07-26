// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { join } from "#std/path/mod.ts"
import { getDenoPath, runCommand, runDenoCommand } from "#lib/binutil/mod.ts"

const denoPath = getDenoPath()
const opts = await new Command()
	.name("init")
	.version("0.1.0")
	.description(
		`The "init" command inializes the repository by executing all the necessary ` +
			`steps to make it work properly. This includes compiling bin files, creating ` +
			`necessary symlinks, installing dependencies, and so on.`
	)
	.option("--silent", "Disable output")
	.parse(Deno.args)

export const main = async () => {
	const sourcesPath = join(Deno.cwd(), "boot", "src")
	const sources = Deno.readDir(sourcesPath)

	const log = opts.options.silent ? () => void 0 : console.log

	for await (const source of sources) {
		if (!source.isDirectory || source.name === "init") continue

		const path = join(sourcesPath, source.name, "mod.ts")

		await runDenoCommand(denoPath, [
			"compile",
			"--allow-read",
			"--allow-write",
			"--allow-run",
			`--output=bin/${source.name}`,
			path,
		])
	}

	const configPath = join(Deno.cwd(), "etc", "init")
	const configSources = Deno.readDir(configPath)

	for await (const source of configSources) {
		log(`Creating soft link for ${source.name}... `)

		const path = join(configPath, source.name)
		await runCommand("ln", ["-snf", path, source.name]).catch(console.error)
	}

	const srvsPath = join(Deno.cwd(), "srv")
	const srvs = Deno.readDir(srvsPath)

	for await (const srv of srvs) {
		if (!srv.isDirectory) continue
		const path = join(srvsPath, srv.name, "bin", "init.ts")
		const exists = await Deno.stat(path).catch(() => false)
		if (!exists) continue

		log(`Executing srv/${srv.name}/bin/init.ts... `)

		await runDenoCommand(denoPath, [
			"run",
			"--allow-read",
			"--allow-write",
			"--allow-run",
			"--allow-env",
			path,
		])
	}

	log("🎉 All done!")
}

await main()
