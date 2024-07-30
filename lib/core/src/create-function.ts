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

import { type TCreateFunctionFn } from "./types"

export const create_function: TCreateFunctionFn =
	(name, permissions, callback) =>
	({
		get_commands,
		get_current_route,
		get_hosts,
		get_is_authenticated,
		get_logger,
		get_translations,
		get_fetch,
		is_dev,
		metadata_query,
		user_query,
		known_functions,
	}) => {
		const fid = known_functions.register(name, permissions)

		if (!fid) return

		const context = {
			fid,
			is_dev,
			get_commands: get_commands(fid),
			get_logger: get_logger(fid),
			get_current_route: get_current_route(fid),
			get_hosts: get_hosts(fid),
			get_is_authenticated: get_is_authenticated(fid),
			get_fetch: get_fetch(fid),
			get_translations,
			metadata_query,
			user_query,
		}

		return callback(context)
	}
