// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { read_file0, write_file0 } from "@ordo-pink/fs"
import { is_string } from "@ordo-pink/tau"

const main = () =>
	read_file0("lib/emojis/src/v16/spec.txt", "utf8")
		.pipe(ops0.chain(content => Oath.If(is_string(content), { T: () => content as string })))
		.pipe(ops0.map(content => content.split("\n")))
		.pipe(ops0.map(lines => lines.filter(line => !line.startsWith("#"))))
		.pipe(ops0.map(lines => lines.filter(line => !!line.trim())))
		.pipe(ops0.map(lines => lines.map(line => line.split("#"))))
		.pipe(
			ops0.map(lines =>
				lines.map(line => line.flatMap((item, index) => (index === 0 ? item.split(";") : item))),
			),
		)
		.pipe(
			ops0.map(lines =>
				lines.map(line => {
					const meta_info_str = line[2]?.trim()
					const icon = meta_info_str.slice(0, meta_info_str.indexOf(" "))
					const description = meta_info_str.slice(meta_info_str.indexOf(" ")).trim()

					return {
						code_point: line[0]?.trim(),
						status: line[1]?.trim(),
						icon: icon.trim(),
						version: description.slice(0, description.indexOf(" ")).trim(),
						description: description.slice(description.indexOf(" ")).trim(),
					}
				}),
			),
		)
		.pipe(
			ops0.map(
				content => `export type TEmojiStatus = "component" | "fully-qualified" | "minimally-qualified" | "unqualified"

export type TEmoji = {
	code_point: string
	status: TEmojiStatus
	icon: string
	version: string
	description: string
}
			
export const emojis: TEmoji[] = ${JSON.stringify(content, null, 2)}`,
			),
		)
		.pipe(ops0.chain(json => write_file0("lib/emojis/index.ts", json, "utf8")))
		.invoke(invokers0.or_else(console.error))

void main()
