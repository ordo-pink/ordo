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

import type { CommandHandler } from "@ordo-pink/cli-handler"
import { oath } from "@ordo-pink/oss-oath"
import { run_command } from "@ordo-pink/cli-runner"

export const handle_precommit: CommandHandler.Fn = () =>
	run_command("bin/dog spdx -bn", { stderr: "inherit", stdout: "inherit" })
		.pipe(oath.ops.chain(() => run_command("opt/bun x eslint lib", { stderr: "inherit", stdout: "inherit" })))
		.pipe(oath.ops.chain(() => run_command("opt/bun test lib", { stderr: "inherit", stdout: "inherit" })))
		.cata(oath.catas.or_else(e => console.error(e.message)))
