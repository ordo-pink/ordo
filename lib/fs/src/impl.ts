// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { join } from "#std/path/mod.ts"

export const getParentPath = (path: string) => {
	const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path

	return join(cleanPath.split("/").slice(0, -1).join("/"))
}

export const getAbsolutePath = (path: string) => {
	return join(Deno.cwd(), path)
}

export const checkFileExists = async (path: string) => {
	const stat = await Deno.stat(path).catch(() => null)

	return stat && stat.isFile
}

export const checkDirectoryExists = async (path: string) => {
	const stat = await Deno.stat(path).catch(() => null)

	return stat && stat.isDirectory
}
