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

import { TCommandRecord } from "@ordo-pink/binutil"

import { mklib_handler } from "./src/cmd-mklib.impl"

// TODO Organise arguments, -shortoptions and --long-options into separate groups
// TODO Extract licence option
export const mklib_command: TCommandRecord = {
	mklib: {
		help: `Create a new library in 'lib' with given name. Example: './bin mklib hello-world'. Options:
		--unlicense, -U :: Use The Unlicense instead of GNU AGPL 3.0`,
		handler: mklib_handler,
	},
}
