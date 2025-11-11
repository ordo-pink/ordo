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

import { SpawnOptions } from "bun"

import { type Oath, oath } from "@ordo-pink/oss-oath"

export const run_async_command = (cmd: string, options?: SpawnOptions.OptionsObject) =>
	oath.of(Bun.spawn(cmd.trim().split(" "), { ...options, stdout: "inherit", stderr: "inherit", stdin: "inherit" }))

type TRunCommandFn = (cmd: string, options?: SpawnOptions.OptionsObject) => Oath.Instance<void, Error>
export const run_command: TRunCommandFn = (command, options) =>
	oath.try_catch(() => {
		const result = Bun.spawnSync(command.trim().split(" "), options)
		const stderr_string = result.stderr?.toString("utf8").trim()

		if (!result.success || result.exitCode > 0) throw new Error(stderr_string)
	})

export const die =
	(code: number = 1) =>
	(error: unknown) => {
		console.error(error)
		process.exit(code)
	}
