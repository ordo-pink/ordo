// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { join } from "#std/path/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { F, noop, prop } from "#lib/tau/mod.ts"

export const oathify =
	<Args extends any[], Result extends Promise<any>>(f: (...args: Args) => Result) =>
	(...args: Args) =>
		Oath.try(() => f(...args))

export const getParentPath = (path: string) => {
	const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path

	return join(cleanPath.split("/").slice(0, -1).join("/"))
}

export const getAbsolutePath = (path: string) => {
	return join(Deno.cwd(), path)
}

export const mkdir = oathify(Deno.mkdir)
export const rmdir = oathify(Deno.remove)
export const writeFile = oathify(Deno.writeFile)
export const readFile = oathify(Deno.readFile)
export const removeFile = rmdir
export const stat = oathify(Deno.stat)

export const mkdirRecursive = (path: string) => mkdir(path, { recursive: true })

export const createDirectoryIfNotExists = (path: string) =>
	stat(path)
		.map(noop)
		.fix(() => mkdirRecursive(path))

export const createParentDirectoryFor = (path: string) =>
	Oath.of(path).map(getParentPath).chain(createDirectoryIfNotExists)

export const readdir = (path: string) =>
	Oath.from(async () => {
		const result = [] as Deno.DirEntry[]

		for await (const item of Deno.readDir(path)) {
			result.push(item)
		}

		return result
	})

export const fileExists = (path: string) => stat(path).map(prop("isFile")).fix(F)
export const directoryExists = (path: string) => stat(path).map(prop("isDirectory")).fix(F)

export const isFile = fileExists
export const isDirectory = directoryExists
