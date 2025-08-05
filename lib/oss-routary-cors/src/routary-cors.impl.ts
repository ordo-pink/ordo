/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Routary } from "@ordo-pink/oss-routary"

import type * as Lib from "./routary-cors.types"

export const create: Lib.Create =
	(allowed_origins, allowed_headers = [], allow_credentials = false, max_age = 0, status = 204) =>
	({ structure }) => {
		const options = {} as Record<string, string[]>

		if (!structure.options) structure.options = {}

		Object.keys(structure).forEach(method => {
			Object.keys(structure[method as Routary.Method]!).forEach(route => {
				if (!options[route]) options[route] = ["options"]
				options[route].push(method)
			})
		})

		Object.keys(options).forEach(route => {
			structure.options![route as Routary.Route] = params => {
				if (typeof allowed_origins === "string") allowed_origins = [allowed_origins]
				const origin = params.request.headers.get("origin")

				if (!origin || !allowed_origins.includes(origin)) return new Response("", { status: 404 })

				const headers = new Headers()

				headers.set("Access-Control-Allow-Origin", origin)
				headers.set("Access-Control-Allow-Methods", options[route].join(", "))

				if (allow_credentials) headers.set("Access-Control-Allow-Credentials", "true")
				if (max_age) headers.set("Access-Control-Max-Age", String(max_age))
				if (allowed_headers.length) headers.set("Access-Control-Allow-Headers", allowed_headers.join(", "))

				return new Response("", { status, headers })
			}
		})

		return {
			after_each: params => {
				if (typeof allowed_origins === "string") allowed_origins = [allowed_origins]
				const origin = params.request.headers.get("origin")

				if (!origin || (!allowed_origins.includes(origin) && !allowed_origins.includes("*"))) return {} as any

				params.response.headers.set("Access-Control-Allow-Origin", origin)

				if (params.matched_route)
					params.response.headers.set("Access-Control-Allow-Methods", options[params.matched_route].join(", "))
				if (allow_credentials) params.response.headers.set("Access-Control-Allow-Credentials", "true")
				if (max_age) params.response.headers.set("Access-Control-Max-Age", String(max_age))
				if (allowed_headers.length) params.response.headers.set("Access-Control-Allow-Headers", allowed_headers.join(", "))

				return {} as any
			},
		}
	}
