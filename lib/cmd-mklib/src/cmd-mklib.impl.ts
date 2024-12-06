/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import node_fs from "node:fs"
import node_path from "node:path"

import { pascal, snake, title } from "case"

import { type TLicenseType, create_progress, get_license, get_spdx_record } from "@ordo-pink/binutil"
import { is_reserved_javascript_keyword } from "@ordo-pink/rkwjs"

export const mklib_handler = async (args: string[]): Promise<void> => {
	const lib_name = args[1]
	const license = "AGPL-3.0-only"

	const progress = create_progress("Creating new library")

	if (!lib_name) {
		progress.break("ERROR: Invalid usage: lib name not provided.")
		process.exit(1)
	}

	if (!Number.isNaN(Number.parseInt(lib_name))) {
		progress.break("ERROR: Invalid usage: lib name must not start with a number.")
		process.exit(1)
	}

	if (is_reserved_javascript_keyword(lib_name)) {
		progress.break(`ERROR: Invalid usage: lib name '${lib_name}' is a reserved JavaScript keyword.`)
		process.exit(1)
	}

	// Add command name to the console output
	progress.inc(` '${lib_name}'`)

	try {
		const lib_path = node_path.join("lib", lib_name)
		const lib_src_path = node_path.join(lib_path, "src")

		const license_path = node_path.join(lib_path, "license")
		const readme_path = node_path.join(lib_path, "readme.md")
		const index_path = node_path.join(lib_path, "index.ts")
		const impl_path = node_path.join(lib_src_path, `${lib_name}.impl.ts`)
		const types_path = node_path.join(lib_src_path, `${lib_name}.types.ts`)
		const test_path = node_path.join(lib_src_path, `${lib_name}.test.ts`)

		const update_progress = () => progress.inc()

		await node_fs.promises.mkdir(lib_src_path, { recursive: true })

		await Promise.all([
			node_fs.promises.writeFile(license_path, get_license(license)).then(update_progress),
			node_fs.promises.writeFile(readme_path, readme(lib_name)).then(update_progress),
			node_fs.promises.writeFile(index_path, index(lib_name, license)).then(update_progress),
			node_fs.promises.writeFile(impl_path, impl(lib_name, license)).then(update_progress),
			node_fs.promises.writeFile(types_path, types(lib_name, license)).then(update_progress),
			node_fs.promises.writeFile(test_path, test(lib_name, license)).then(update_progress),
		])

		progress.finish()
	} catch (e) {
		try {
			await node_fs.promises.rm(`lib/${lib_name}`, { recursive: true, force: true })
			progress.break("ERROR: Failed to create necessary lib files: ", e)
		} catch (e) {
			progress.break("ERROR: Unexpected FS error:", e)
		}

		process.exit(1)
	}
}

// --- Internal ---

const index = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
export * from "./src/${name}.impl"
export * from "./src/${name}.types"
`

const impl = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
import type { T${pascal(name)} } from "./${name}.types"

export const ${snake(name)}: T${pascal(name)} = "${name}"
`

const types = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
export type T${pascal(name)} = "${name}"
`

const test = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
import { expect, test } from "bun:test"
import { ${snake(name)} } from "./${name}.impl"

test("${name} should pass", () => {
	expect(${snake(name)}).toEqual("${name}")
})
`

const readme = (name: string) => `# ${title(name)}
`
