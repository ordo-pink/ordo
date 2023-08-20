// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Context } from "koa"
import { Oath } from "@ordo-pink/oath"
import { isObject } from "@ordo-pink/tau"
import { HttpError } from "@ordo-pink/rrr"
import { Switch } from "@ordo-pink/switch"

export const useBody = <T>(
	ctx: Context,
	expect: "string" | "array" | "object" = "object"
): Oath<T, HttpError> =>
	Oath.from(() => ctx.request.body as Promise<T>)
		.map(body =>
			Switch.of(expect)
				.case(
					expect => expect === "object" && !isObject(body),
					() => HttpError.BadRequest("Request body must be an object")
				)
				.case(
					expect => expect === "string" && typeof body !== "string",
					() => HttpError.BadRequest("Request body must be a string")
				)
				.case(
					expect => expect === "array" && !Array.isArray(body),
					() => HttpError.BadRequest("Request body must be an array")
				)
				.default(() => body)
		)
		.chain(result =>
			Oath.try(() => {
				if (result instanceof HttpError) throw result
				return result
			})
		)
