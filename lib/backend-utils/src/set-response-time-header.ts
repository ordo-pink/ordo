// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Middleware } from "#x/oak@v12.6.0/mod.ts"

export const setResponseTimeHeader: Middleware = async (ctx, next) => {
	const start = Date.now()
	await next()
	const ms = Date.now() - start

	ctx.response.headers.set("X-Response-Time", ms.toString())
}
