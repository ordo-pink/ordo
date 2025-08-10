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

import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import { curry } from "@ordo-pink/oss-curry"
import { oath } from "@ordo-pink/oss-oath"
import { server } from "@ordo-pink/sdk-server"
import { server_routary } from "@ordo-pink/sdk-server-routary"

import type * as Lib from "../b-server-id.types"

export const get_user_by_email: Lib.Handler = ({ env, params }) =>
	oath
		.from_nullable(params && params.email, to_missing_email_rrr)
		.pipe(oath.ops.chain(validate_email))
		.pipe(oath.ops.chain(env.user_repository.get_by_email))
		.pipe(oath.ops.map(server.user.serialize_other))
		.pipe(oath.ops.chain(server_routary.oaths.to_json))
		.pipe(oath.ops.map(core.fns.construct(Response)))
		.pipe(oath.ops.tap(server_routary.set_response_header("Content-Type", "application/json")))
		.cata(oath.catas.or_else(env.fail))

// --- Internal ---

const einval = curry(core.rrr.einval)
const to_missing_email_rrr = einval(CORE.RRR.REASON.EMAIL_MISSING)
const to_invalid_email_rrr = (e: string) => () => core.rrr.einval(CORE.RRR.REASON.EMAIL_INVALID, e)
const validate_email = (e: string) =>
	oath.if(core.user.email_guard(e), { on_false: to_invalid_email_rrr(e), on_true: () => e as Core.User.Email })
