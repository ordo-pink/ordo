// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { join } from "#std/path/mod.ts"
import { Command } from "#x/cliffy@v1.0.0-rc.2/command/command.ts"
import { red } from "#std/fmt/colors.ts"

const opts = await new Command()
	.name("test")
	.version("0.1.0")
	.description(
		`The "test" command runs tests found deeply nested in directories ` +
			`provided as arguments. Using "bin/test ." will find and run all tests ` +
			`in the repository.`
	)
	.arguments("<directories...>")
	.option("--verbose", "Enable output")
	.option("--no-color", "Disable color output")
	.parse(Deno.args)

const testFiles: string[] = []

/**
 * Reducer function to create an array of "$ARG/<every_child>/bin/test" paths
 * from an array of directory children.
 */
const collectTestFiles = async (path: string) => {
	const children = Deno.readDir(path)

	for await (const child of children) {
		if (child.isDirectory) {
			await collectTestFiles(join(path, child.name))
		} else if (child.isFile && child.name.endsWith(".test.ts")) {
			testFiles.push(join(path, child.name))
		}
	}
}

const main = async (args: string[]) => {
	const paths = args.map(arg => join(Deno.cwd(), arg))
	const denoPath = join(Deno.cwd(), "opt", "deno")

	for (const path of paths) {
		try {
			await collectTestFiles(path)
		} catch (_) {
			console.error(`${red("✗")} Could not find directory "${path}".`)
			Deno.exit(1)
		}
	}

	for (const testFile of testFiles) {
		const args = ["run", "--allow-read", testFile]

		if (opts.options.verbose) args.push("--verbose")
		if (!opts.options.color) args.push("--no-color")

		const command = new Deno.Command(denoPath, {
			args,
			stdout: "piped",
			stderr: "piped",
		})

		try {
			const { stdout, stderr } = await command.output()

			Deno.stdout.write(stdout)
			Deno.stderr.write(stderr)
		} catch (e) {
			console.log(e)
		}
	}
}

await main(opts.args)
