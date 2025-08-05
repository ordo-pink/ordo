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

import { routary } from "@ordo-pink/oss-routary"

import type * as Lib from "./b-server-core.types"
import * as log from "./log/log.impl"
import * as request_id from "./request-id/request-id.impl"
import * as request_ip from "./request-ip/request-ip.impl"
import * as request_lang from "./request-lang/request-lang.impl"
import * as response_timer from "./response-timer/response-timer.impl"

export const create: Lib.Create = (env, mut) =>
	routary
		.create(env, mut)
		.pipe(routary.ops.before_each(request_id.set))
		.pipe(routary.ops.before_each(request_lang.set))
		.pipe(routary.ops.before_each(request_ip.set))
		.pipe(routary.ops.before_each(response_timer.start))
		.pipe(routary.ops.after_each(response_timer.end))
		.pipe(routary.ops.after_each(log.request))
