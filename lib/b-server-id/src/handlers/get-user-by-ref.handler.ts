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

import { oath } from "@ordo-pink/oss-oath"
import { server } from "@ordo-pink/sdk-server"

import type * as Lib from "../b-server-id.types"
import * as id_common from "../common"

export const get_user_by_ref: Lib.Handler = ({ env, params }) =>
	id_common
		.get_param_ref(params)
		.pipe(oath.ops.chain(env.user_repository.get_by_ref))
		.pipe(oath.ops.map(server.user.serialize_other))
		.pipe(oath.ops.map(Response.json))
		.cata(oath.catas.or_else(env.fail))
