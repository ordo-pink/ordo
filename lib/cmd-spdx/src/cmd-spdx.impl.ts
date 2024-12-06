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

import { type TLicenseType, create_progress, get_license, get_spdx_record } from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"

const unlicense = get_license("Unlicense")
const progress = create_progress("Adding missing SPDX records")

export const handle_spdx = async () => {
	await Oath.Merge([...(await create_licenses("lib")), ...(await create_licenses("srv"))])
		.and(xs => Oath.Merge(xs.flatMap(x => x)))
		.and(xs => xs.filter(Boolean))
		.fork(e => progress.break("ERROR: Unexpected error", e), noop)

	progress.finish()
}

// --- Internal ---

const create_licenses = async (space: "lib" | "srv") => {
	const entries = await node_fs.promises.readdir(space)

	return entries.map(async entry => {
		const entry_path = node_path.join(space, entry)
		const license_path = node_path.join(entry_path, "license")
		const license_exists = await node_fs.promises.exists(license_path)

		if (!license_exists) return

		const license_content = await node_fs.promises.readFile(license_path, "utf-8")
		const license: TLicenseType = license_content === unlicense ? "Unlicense" : "AGPL-3.0-only"
		const spdx = get_spdx_record(license)

		const files = await node_fs.promises.readdir(entry_path, { recursive: true })

		return files.map(async file => {
			if (!file.endsWith(".ts") || file.includes("node_modules")) return

			const file_path = node_path.join(entry_path, file)
			const file_content = await node_fs.promises.readFile(file_path, "utf-8")

			if (!file_content.startsWith(spdx)) {
				const updated_content = `${spdx}\n${file_content}`

				await node_fs.promises.writeFile(file_path, updated_content, "utf-8")

				progress.inc()
			}
		})
	})
}
