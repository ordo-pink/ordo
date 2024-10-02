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

import { type Context } from "koa"

import { type JTI, type SUB } from "@ordo-pink/wjwt"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/managers"
import { is_uuid } from "@ordo-pink/tau"

export const set_auth_cookie = (ctx: Context, sub: SUB, jti: JTI, expires: Date): void => {
	ctx.response.set("Set-Cookie", [
		`jti=${jti}; Expires=${expires.toUTCString()}; SameSite=Lax; Path=/; HttpOnly;`,
		`sub=${sub}; Expires=${expires.toUTCString()}; SameSite=Lax; Path=/; HttpOnly;`,
	])
}

export const remove_auth_cookie = (ctx: Context) => () => {
	ctx.response.set("Set-Cookie", [
		"jti=removed; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Path=/; HttpOnly;",
		"sub=removed; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Path=/; HttpOnly;",
	])
}

export const get_auth_cookies0 = (sub?: string, jti?: string) =>
	Oath.Merge({
		sub: Oath.FromNullable(sub)
			.pipe(Oath.ops.chain(sub => Oath.If(is_uuid(sub), { T: () => sub as SUB, F: () => sub })))
			.pipe(Oath.ops.rejected_map(sub => einval(`get_auth_cookies -> sub: ${sub}`))),
		jti: Oath.FromNullable(jti)
			.pipe(Oath.ops.chain(jti => Oath.If(is_uuid(jti), { T: () => jti as JTI, F: () => jti })))
			.pipe(Oath.ops.rejected_map(jti => einval(`get_auth_cookies -> jti: ${jti}`))),
	})

// --- Internal ---

const LOCATION = "cookies"

const einval = RRR.codes.einval(LOCATION)
