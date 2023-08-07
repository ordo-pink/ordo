// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getDenoPath, runCommand, runDenoCommand } from "#lib/binutil/mod.ts"
import { isFile, readdir } from "#lib/fs/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { Binary, Curry, Thunk, Unary } from "#lib/tau/mod.ts"
import { prop } from "#ramda"

// --- Public ---

export const init: CoverFn = () =>
	Oath.of(getDenoPath()).chain(path =>
		compileBin(path)
			.chain(() => initSrv(path))
			.chain(createSymlinks)
	)

// --- Internal ---

type CoverFn = Thunk<Oath<number, Error>>
type InitSrvFn = Unary<string, Oath<number, never>>
type CreateSymlincsFn = Thunk<Oath<number, never>>
type CompileBinFn = Unary<string, Oath<number, never>>
type LogFn = Curry<Binary<string, number, void>>

const initSrv: InitSrvFn = denoPath =>
	readdir("./srv")
		.map(entries => entries.filter(entry => entry.isDirectory))
		.map(entries =>
			entries.map(entry =>
				isFile(`./srv/${entry.name}/bin/init.ts`).map(x =>
					x ? `./srv/${entry.name}/bin/init.ts` : null
				)
			)
		)
		.chain(entries => Oath.all(entries))
		.map(entries => entries.filter(Boolean) as string[])
		.chain(entries =>
			Oath.all(
				entries.map(path =>
					runDenoCommand(denoPath, [
						"run",
						"--allow-read",
						"--allow-write",
						"--allow-run",
						"--allow-env",
						path,
					])
				)
			).map(prop("length"))
		)

const createSymlinks: CreateSymlincsFn = () =>
	readdir("./etc/init")
		.map(entries => entries.filter(entry => entry.isFile))
		.chain(entries =>
			Oath.all(
				entries.map(entry => runCommand("ln", ["-snfv", `./etc/init/${entry.name}`, entry.name]))
			)
		)
		.map(prop("length"))

const compileBin: CompileBinFn = (denoPath: string) =>
	readdir("./boot/src")
		.map(entries => entries.filter(entry => entry.isDirectory && entry.name !== "init"))
		.chain(entries =>
			Oath.all(
				entries.map(entry =>
					runDenoCommand(denoPath, [
						"compile",
						"--allow-read",
						"--allow-write",
						"--allow-run",
						`--output=bin/${entry.name}`,
						`./boot/src/${entry.name}/mod.ts`,
					])
				)
			)
		)
		.map(prop("length"))
