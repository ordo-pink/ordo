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

import { Context } from "koa"

import { O, type TOption } from "@ordo-pink/option"
import { type TAuthJWT, type TTokenService } from "@ordo-pink/backend-service-token"
import { from_option0, is_non_empty_string, is_string } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"

export const authenticate0 = (
	ctx: Context,
	token_service_or_id_host: TTokenService | string,
): Oath<TAuthJWT, Ordo.Rrr<"EINVAL" | "EIO" | "EACCES">> =>
	Oath.If(is_non_empty_string(ctx.header.authorization) && ctx.header.authorization.startsWith("Bearer "), {
		T: () => ctx.header.authorization as string,
		F: () => einval("Authentication token not provided"),
	}).pipe(
		Oath.ops.chain(token =>
			(is_string(token_service_or_id_host)
				? verify_with_id_server0(token_service_or_id_host, token)
				: verify_with_token_service0(token_service_or_id_host, token.slice(7))
			).pipe(Oath.ops.chain(from_option0(() => eacces("User not authenticated")))),
		),
	)

// --- Internal ---

const LOCATION = "authenticate"

const einval = RRR.codes.einval(LOCATION)
const eacces = RRR.codes.eacces(LOCATION)
const eio = RRR.codes.eio(LOCATION)

const verify_with_id_server0 = (id_host: string, authorization: string): Oath<TOption<TAuthJWT>, Ordo.Rrr<"EINVAL" | "EIO">> =>
	Oath.FromPromise(() => fetch(`${id_host}/verify-token`, { method: "POST", headers: { authorization } }))
		.pipe(Oath.ops.chain(res => Oath.FromPromise(() => res.json())))
		.pipe(Oath.ops.rejected_map(e => eio(`verify_with_id_server -> error: ${e.message}`)))
		.pipe(Oath.ops.map(res => (res.success ? O.Some(res.result as TAuthJWT) : O.None())))

const verify_with_token_service0 = (
	token_service: TTokenService,
	token: string,
): Oath<TOption<TAuthJWT>, Ordo.Rrr<"EINVAL" | "EIO">> =>
	token_service
		.verify(token, "access")
		.pipe(Oath.ops.chain(is_valid => Oath.If(is_valid, { F: () => einval("Invalid token") })))
		.pipe(Oath.ops.chain(() => token_service.decode(token, "access")))
