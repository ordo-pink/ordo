// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { join } from "#std/path/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { identity } from "#lib/tau/mod.ts"
import { checkDirectoryExists, getAbsolutePath, getParentPath } from "#lib/fs/mod.ts"

export const getDenoPath = () => join(Deno.cwd(), "opt", "deno")

export const runCommand = (command: string, args: string[]) =>
	Oath.of(args)
		.map(args => new Deno.Command(command, { args, stdout: "piped", stderr: "piped" }))
		.chain(command => Oath.try(() => command.spawn()))
		.fork(identity, async ({ stdout, stderr }) => {
			for await (const chunk of stdout) Deno.stdout.write(chunk)
			for await (const chunk of stderr) Deno.stderr.write(chunk)
		})

export const runDenoCommand = (denoPath: string, args: string[]) => runCommand(denoPath, args)

export const generateFile = async (path: string, content: string) => {
	const parentPath = getParentPath(path)
	const encoder = new TextEncoder()

	if (!(await checkDirectoryExists(parentPath))) {
		await Deno.mkdir(parentPath, { recursive: true })
	}

	await Deno.writeFile(path, encoder.encode(content))
}
