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

export const create_function: Ordo.CreateFunction.Fn = (name, permissions, callback) => ctx => {
	const fid = ctx.known_functions.register(name, permissions)

	if (!fid) return

	return callback({
		commands: ctx.get_commands(fid),
		content_query: ctx.get_content_query(fid),
		fetch: ctx.get_fetch(fid),
		logger: ctx.get_logger(fid),
		router$: ctx.get_router(fid),
		metadata_query: ctx.get_metadata_query(fid),
		translate: ctx.translate,
		user_query: ctx.get_user_query(fid),
		file_associations$: ctx.get_file_associations(fid),
	})
}
