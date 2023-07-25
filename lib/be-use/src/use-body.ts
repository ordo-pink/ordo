// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import { BodyType, Context } from "#x/oak@v12.6.0/mod.ts"
import { isObject } from "#lib/tau/mod.ts"

// TODO: Rewrite useBody with Oath
export const useBody = async <T>(
	ctx: Context,
	type: BodyType = "json",
	expect: "string" | "array" | "object" = "object"
): Promise<T> => {
	const bodyContent = ctx.request.body({ type })

	const body: T = await bodyContent.value

	if (expect === "object" && !isObject(body)) {
		ctx.throw(400, "Request body must be an object")
	} else if (expect === "string" && typeof body !== "string") {
		ctx.throw(400, "Request body must be a string")
	} else if (expect === "array" && !Array.isArray(body)) {
		ctx.throw(400, "Request body must be an array")
	}

	return body
}
