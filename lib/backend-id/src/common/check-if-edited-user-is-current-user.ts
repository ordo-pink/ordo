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

import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TIDContext } from "../backend-id.types"
import { get_token_from_authorization_header } from "./get-auth-token-from-authorization-header"
import { get_user_from_token } from "./get-user-from-token"
import { verify_auth_token } from "./verify-auth-token"

export const check_if_edited_user_is_current_user = (i: TIntake<TIDContext>) =>
	get_token_from_authorization_header(i)
		.and(verify_auth_token(i))
		.and(get_user_from_token(i))
		.and(u => Oath.If(u.id === i.params.user_id, { F: () => ({ rrr: RRR.codes.eperm("Cannot edit other user"), intake: i }) }))
