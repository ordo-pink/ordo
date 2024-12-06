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

import { is_array, is_object, is_string } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"

export const parse_body0 = <T>(ctx: Context, expect: "string" | "array" | "object" = "object"): Oath<T, Ordo.Rrr<"EINVAL">> =>
	Oath.Try(async () => (await ctx.request.body) as T)
		.pipe(Oath.ops.rejected_map(error => einval(`body parser error: ${error.message}`)))
		.pipe(
			Oath.ops.chain(body =>
				Oath.Merge([
					Oath.If(expect === "object" && !is_object(body))
						.pipe(Oath.ops.swap)
						.pipe(Oath.ops.rejected_map(() => einval("Expected object"))),
					Oath.If(expect === "array" && !is_array(body))
						.pipe(Oath.ops.swap)
						.pipe(Oath.ops.rejected_map(() => einval("Expected array"))),
					Oath.If(expect === "string" && !is_string(body))
						.pipe(Oath.ops.swap)
						.pipe(Oath.ops.rejected_map(() => einval("Expected string"))),
				]).pipe(Oath.ops.map(() => body)),
			),
		)

// --- Internal ---

const LOCATION = "parse_body"

const einval = RRR.codes.einval(LOCATION)
