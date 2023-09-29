// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getc } from "@ordo-pink/getc"
import { Oath } from "@ordo-pink/oath"
import { Router } from "@ordo-pink/routary"
import { extend, noop } from "@ordo-pink/tau"

const { GSTATS_PORT } = getc(["GSTATS_PORT"])

const createSuccessMessage = <T>(result?: T) => ({ success: true, result })
const createErrorMessage = (error?: string) => ({ success: false, error })
const setHeader = (key: string, value: string) =>
	extend(<T>(ctx: StatsCtx<T>) => ({
		headers: { ...ctx.headers, [key]: value },
	}))
const createResponse = ({ body = "", headers, status }: StatsCtx<string>) =>
	new Response(body, { status, headers })
const bodyToJSON = (x: StatsCtx) =>
	Oath.of(x)
		.map(extend(<T>({ body }: StatsCtx<T>) => ({ body: JSON.stringify(body) })))
		.map(setHeader("content-type", "application/json"))

const fetch = Router.create()
	.post("/data-removed", () =>
		Oath.of(createContext({ body: createSuccessMessage() }))
			.chain(bodyToJSON)
			.fork(noop, createResponse),
	)
	.post("/data-created", () =>
		Oath.of(createContext({ body: createSuccessMessage() }))
			.chain(bodyToJSON)
			.fork(noop, createResponse),
	)
	.post("/user-removed", () =>
		Oath.of(createContext({ body: createSuccessMessage() }))
			.chain(bodyToJSON)
			.fork(noop, createResponse),
	)
	.post("/user-signed-up", () =>
		Oath.of(createContext({ body: createSuccessMessage() }))
			.chain(bodyToJSON)
			.fork(noop, createResponse),
	)
	.get(/\/.*/, req =>
		Oath.of(createContext({ body: createSuccessMessage() }))
			.chain(bodyToJSON)
			.fork(noop, createResponse),
	)
	.get("/healthcheck", () =>
		Oath.of(createContext({ body: createSuccessMessage("OK") }))
			.chain(bodyToJSON)
			.fork(noop, createResponse),
	)
	.orElse(() => new Response("Not found", { status: 404 }))

Bun.serve({ fetch, port: GSTATS_PORT })

type StatsCtx<T = any> = {
	body?: T
	headers: Record<string, string>
	status: number
}

const createContext = <T>(
	{ status = 200, body = "", headers = {} }: Partial<StatsCtx> = {
		status: 200,
		body: "",
		headers: {},
	},
): StatsCtx<T> => ({ body, status, headers })
