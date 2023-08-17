// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Context } from "koa"
import { isObject } from "@ordo-pink/tau"

// TODO: Rewrite useBody with Oath
export const useBody = async <T>(
	ctx: Context,
	expect: "string" | "array" | "object" = "object"
) => {
	const body = (await ctx.request.body) as T

	if (expect === "object" && !isObject(body)) {
		ctx.throw(400, "Request body must be an object")
	} else if (expect === "string" && typeof body !== "string") {
		ctx.throw(400, "Request body must be a string")
	} else if (expect === "array" && !Array.isArray(body)) {
		ctx.throw(400, "Request body must be an array")
	}

	return body
}
