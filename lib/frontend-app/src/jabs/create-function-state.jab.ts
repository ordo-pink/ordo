/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { type TMaokaJab } from "@ordo-pink/maoka"

import { type TFunctionStateSource } from "./create-function-state-source.jab"

export const create_function_state =
	(fid: symbol, source: TFunctionStateSource): TMaokaJab<Ordo.CreateFunction.State> =>
	() => ({
		commands: source.get_commands(fid),
		content_query: source.get_content_query(fid),
		fetch: source.get_fetch(fid),
		file_associations$: source.get_file_associations(fid),
		logger: source.get_logger(fid),
		metadata_query: source.get_metadata_query(fid),
		router$: source.get_router(fid),
		translate: source.translate,
		user_query: source.get_user_query(fid),
	})
