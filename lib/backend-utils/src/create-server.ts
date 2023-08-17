// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Unary } from "#lib/tau/mod.ts"
import { Application, Router } from "#x/oak@v12.6.0/mod.ts"
import { logRequest } from "#lib/backend-utils/src/log-request.ts"
import { setResponseTimeHeader } from "#lib/backend-utils/src/set-response-time-header.ts"
import { handleError } from "#lib/backend-utils/src/user-error.ts"
import { oakCors } from "#x/cors@v1.2.2/oakCors.ts"
import { ConsoleLogger, Logger } from "#lib/logger/mod.ts"
import { identity } from "#ramda"

export type CreateServerParams = {
	origin?: string | string[]
	logger?: Logger
	serverName: string
	extendRouter?: Unary<Router, Router>
}
export type CreateServerFn = Unary<CreateServerParams, Application>

export const createServer: CreateServerFn = ({
	origin,
	serverName,
	extendRouter = identity,
	logger = ConsoleLogger,
}) => {
	const router = extendRouter(new Router())

	router.get("/healthcheck", ctx => {
		ctx.response.body = "OK"
		ctx.response.status = 200
	})

	const app = new Application()

	app.use(logRequest({ logger, serverName }))
	app.use(setResponseTimeHeader)
	app.use(handleError({ logger }))
	app.use(oakCors({ origin, credentials: true }))
	app.use(router.routes())
	app.use(router.allowedMethods())

	return app
}