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

import type { Core } from "@ordo-pink/sdk-core"
import type { Curried } from "@ordo-pink/oss-curry"
import type { Oath } from "@ordo-pink/oss-oath"
import type { Server } from "@ordo-pink/sdk-server"
import type { Wjwt } from "@ordo-pink/oss-wjwt"

export type Args = [user_repository: Server.User.Repository, code_service: Server.Code.Service]

export type Instance = {
	request_auth_code: Curried<(email: Core.User.Email) => Oath.Instance<Server.User.Instance, Core.Rrr.Instance<"EIO">>>
	authenticate: Curried<
		(
			email: Core.User.Email,
			code: Server.Code.Instance,
		) => Oath.Instance<
			[user: Server.User.Instance, token: Wjwt.Token, token_string: Wjwt.TokenString],
			Core.Rrr.Instance<"EIO" | "ENOENT" | "EEXIST">
		>
	>
	sign_out: Curried<
		(user_id: Core.User.Id, session_id: Server.User.SessionId) => Oath.Instance<void, Core.Rrr.Instance<"EIO" | "ENOENT">>
	>
	request_email_change: (
		id: Core.User.Id,
		new_email: Core.User.Email,
	) => Oath.Instance<void, Core.Rrr.Instance<"EIO" | "ENOENT" | "EEXIST">>
	change_email: (
		id: Core.User.Id,
		new_email: Core.User.Email,
	) => Oath.Instance<void, Core.Rrr.Instance<"EIO" | "ENOENT" | "EEXIST">>
}

export type Create = (...args: Args) => Instance
