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

import { join } from "node:path"
import { promises } from "node:fs"

import { type License, get_license, get_spdx_record } from "@ordo-pink/cli-license"
import type { CommandHandler } from "@ordo-pink/cli-handler"
import { create_progress } from "@ordo-pink/cli-progress"
import { reserved_javascript_keywords } from "@ordo-pink/cli-rkwjs"

export const mklib_handler: CommandHandler.Fn = async opts => {
	const lib_name = opts.args[1]
	const license = opts.long_options["unlicense"] || opts.short_options["U"] ? "Unlicense" : "AGPL-3.0-only"

	const progress = create_progress("Creating new library")

	if (!lib_name) {
		progress.break("ERROR: Invalid usage: lib name not provided.")
		process.exit(1)
	}

	if (!Number.isNaN(Number.parseInt(lib_name))) {
		progress.break("ERROR: Invalid usage: lib name must not start with a number.")
		process.exit(1)
	}

	if (reserved_javascript_keywords.guard(lib_name)) {
		progress.break(`ERROR: Invalid usage: lib name '${lib_name}' is a reserved JavaScript keyword.`)
		process.exit(1)
	}

	// Add command name to the console output
	progress.inc(` '${lib_name}'`)

	try {
		const lib_path = join("lib", lib_name)
		const lib_src_path = join(lib_path, "src")

		const license_path = join(lib_path, "license")
		const readme_path = join(lib_path, "readme.md")
		const index_path = join(lib_path, "index.ts")
		const impl_path = join(lib_src_path, `${lib_name}.impl.ts`)
		const types_path = join(lib_src_path, `${lib_name}.types.ts`)
		const test_path = join(lib_src_path, `${lib_name}.test.ts`)

		const update_progress = () => progress.inc()

		await promises.mkdir(lib_src_path, { recursive: true })

		await Promise.all([
			promises.writeFile(license_path, get_license(license)).then(update_progress),
			promises.writeFile(readme_path, readme(lib_name)).then(update_progress),
			promises.writeFile(index_path, index(lib_name, license)).then(update_progress),
			promises.writeFile(impl_path, impl(lib_name, license)).then(update_progress),
			promises.writeFile(types_path, types(lib_name, license)).then(update_progress),
			promises.writeFile(test_path, test(lib_name, license)).then(update_progress),
		])

		progress.finish()
	} catch (e) {
		try {
			await promises.rm(`lib/${lib_name}`, { recursive: true, force: true })
			progress.break(`ERROR: Failed to create necessary lib files: ${String(e)}`)
		} catch (e) {
			progress.break(`ERROR: Unexpected FS error: ${String(e)}`)
		}

		process.exit(1)
	}
}

// --- Internal ---

const pascal = (s: string) =>
	s
		.split("-")
		.map(s => title(s))
		.join("")

const snake = (s: string) => s.split("-").join("_")

const title = (s: string) => s[0].toLocaleUpperCase().concat(s.slice(1))

const index = (name: string, license: License.Type) => `${get_spdx_record(license)}
export * from "./src/${name}.impl"
export * from "./src/${name}.types"
`

const impl = (name: string, license: License.Type) => `${get_spdx_record(license)}
import type { ${pascal(name)} } from "./${name}.types"

export const ${snake(name)}: ${pascal(name)}.Static = "${name}"
`

const types = (name: string, license: License.Type) => `${get_spdx_record(license)}
export namespace ${pascal(name)} {
	export type Static = "${name}"
}
`

const test = (name: string, license: License.Type) => `${get_spdx_record(license)}
import { describe, expect, it } from "bun:test"

import { ${snake(name)} } from "./${name}.impl"

describe("${name}", () => {
	it("should exist", () => {
		expect(${snake(name)}).toBe("${name}")
	})
})
`

const readme = (name: string) => `# ${title(name)}
`
