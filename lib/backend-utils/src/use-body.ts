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

import { Context } from "koa"
import { Oath } from "@ordo-pink/oath"
import { isObject } from "@ordo-pink/tau"
import { HttpError } from "@ordo-pink/rrr"
import { Switch } from "@ordo-pink/switch"

export const parseBody0 = <T>(
	ctx: Context,
	expect: "string" | "array" | "object" = "object",
): Oath<T, HttpError> =>
	Oath.try(async () => (await ctx.request.body) as T)
		.rejectedMap(HttpError.from)
		.map(body =>
			Switch.of(expect)
				.case(
					expect => expect === "object" && !isObject(body),
					() => HttpError.BadRequest("Request body must be an object"),
				)
				.case(
					expect => expect === "string" && typeof body !== "string",
					() => HttpError.BadRequest("Request body must be a string"),
				)
				.case(
					expect => expect === "array" && !Array.isArray(body),
					() => HttpError.BadRequest("Request body must be an array"),
				)
				.default(() => body),
		)
		.chain(result =>
			Oath.try(() => {
				if (result instanceof HttpError) throw result
				return result
			}),
		)
