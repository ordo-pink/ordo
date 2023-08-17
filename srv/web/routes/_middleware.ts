// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { MiddlewareHandlerContext } from "$fresh/server.ts"
import { getCookies } from "#std/http/cookie.ts"
import { getc } from "#lib/getc/mod.ts"

const { WORKSPACE_HOST } = getc(["WORKSPACE_HOST"])

export const handler = (req: Request, ctx: MiddlewareHandlerContext) => {
	const cookies = getCookies(req.headers)
	const url = new URL(req.url)
	const hasRequiredCookies = Boolean(cookies.jti && cookies.sub)

	if (
		hasRequiredCookies &&
		["/sign-in", "/sign-up", "/forgot-password", "/"].includes(url.pathname)
	) {
		return new Response(null, { status: 307, headers: new Headers({ Location: WORKSPACE_HOST }) })
	}

	if (!hasRequiredCookies && url.pathname.startsWith("/~")) {
		return new Response(null, { status: 307, headers: new Headers({ Location: "/sign-in" }) })
	}

	return ctx.next()
}
