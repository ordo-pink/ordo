// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { BodyType, Context } from "#x/oak@v12.6.0/mod.ts"
import { isObject } from "#lib/tau/mod.ts"

// TODO: Rewrite useBody with Oath
export const useBody = async <T>(
	ctx: Context,
	type: BodyType = "json",
	expect: "string" | "array" | "object" = "object",
) => {
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
