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

import type * as T from "./log.types"

export const request: T.Request = ({ env, mut, request, response }) => {
	const method = request.method
	const status = response.status
	const { request_id, request_ip, request_language, response_time } = mut

	const url_obj = new URL(request.url)
	const pathname =
		url_obj.pathname.endsWith("/") && url_obj.pathname.length > 1 ? url_obj.pathname.slice(0, -1) : url_obj.pathname

	const url = `${pathname}${url_obj.search}`

	env.logger.info(`${request_id} ${status} ${method} ${request_language} ${url} (${response_time}ms) - ${request_ip}`)
}
