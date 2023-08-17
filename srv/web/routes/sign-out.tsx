// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Handlers } from "$fresh/server.ts"
import { deleteCookie } from "#std/http/cookie.ts"

export const handler: Handlers = {
	GET: async () => {
		await fetch("http://localhost:3001/sign-out", {
			credentials: "include",
			method: "POST",
		})

		const headers = new Headers()

		deleteCookie(headers, "sub")
		deleteCookie(headers, "jti")

		headers.set("Location", "/")

		return new Response(null, { status: 307, headers })
	},
}
