// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { join } from "path"
import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"
import { cwd } from "process"
import { promises } from "fs"

export const oathify =
	<Args extends any[], Result extends Promise<any>>(f: (...args: Args) => Result) =>
	(...args: Args) =>
		Oath.try(() => f(...args))

export const getParentPath = (path: string) => {
	const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path

	return join(cleanPath.split("/").slice(0, -1).join("/"))
}

export const getAbsolutePath = (path: string) => {
	return join(cwd(), path)
}

export const mkdir0 = oathify(promises.mkdir)
export const rmdir0 = oathify(promises.rm)
export const createFile0 = oathify(promises.writeFile)
export const writeFile0 = createFile0
export const readFile0 = oathify(promises.readFile)
export const removeFile0 = rmdir0
export const stat0 = (...args: Parameters<typeof promises.stat>) =>
	Oath.from(() => promises.stat(...args).catch(() => Promise.reject(null)))
export const readdir0 = oathify(promises.readdir)
export const mkdirRecursive0 = (path: string) => mkdir0(path, { recursive: true })

export const createDirectoryIfNotExists0 = (path: string) =>
	stat0(path)
		.fix(() => mkdirRecursive0(path))
		.map(noop)

export const createParentDirectory0 = (path: string) =>
	Oath.of(path).map(getParentPath).chain(createDirectoryIfNotExists0)

export const fileExists0 = (path: string) =>
	stat0(path)
		.map(stat => stat.isFile())
		.fix(() => false)

export const directoryExists0 = (path: string) =>
	stat0(path)
		.map(stat => stat.isDirectory())
		.fix(() => false)

export const isFile0 = fileExists0
export const isDirectory0 = directoryExists0
