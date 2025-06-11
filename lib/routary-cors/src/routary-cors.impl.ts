/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Routary, routary } from "@ordo-pink/routary"

import type { RoutaryCORS } from "./routary-cors.types"

export const routary_cors: RoutaryCORS.Fn =
	({ allow_origin, allow_headers = [], max_age = 0, success_status = 204, allow_credentials = false }) =>
	(fuel, shaft) => {
		const options = {} as Record<string, string[]>

		Object.keys(shaft).forEach(bearing => {
			if (bearing === "OPTIONS") return

			Object.keys(shaft[bearing as Routary.Bearing] as Record<Routary.Gasket, Routary.Gear<{}>>).forEach(gasket => {
				if (!options[gasket]) options[gasket] = ["OPTIONS"]
				options[gasket].push(bearing)

				const gear = shaft[bearing as Routary.Bearing]![gasket]

				shaft[bearing as Routary.Bearing]![gasket] = intake => {
					if (typeof allow_origin === "string") allow_origin = [allow_origin]
					const origin = intake.req.headers.get("origin")

					if (!origin || !allow_origin.includes(origin)) return gear(intake)

					intake.res.headers.set("Access-Control-Allow-Origin", origin)
					intake.res.headers.set("Access-Control-Allow-Methods", options[gasket].join(", "))

					if (allow_credentials) intake.res.headers.set("Access-Control-Allow-Credentials", "true")
					if (max_age) intake.res.headers.set("Access-Control-Max-Age", String(max_age))
					if (allow_headers.length) intake.res.headers.set("Access-Control-Allow-Headers", allow_headers.join(", "))

					return gear(intake)
				}
			})
		})

		if (!shaft.OPTIONS) shaft.OPTIONS = {}

		Object.keys(options).forEach(gasket => {
			shaft.OPTIONS![gasket] = (intake: Routary.Intake<Record<string, unknown>>) => {
				if (typeof allow_origin === "string") allow_origin = [allow_origin]
				const origin = intake.req.headers.get("origin")

				if (!origin || !allow_origin.includes(origin)) return new Response("", { status: 404 })

				const headers = new Headers()

				headers.set("Access-Control-Allow-Origin", origin)
				headers.set("Access-Control-Allow-Methods", options[gasket].join(", "))

				if (allow_credentials) headers.set("Access-Control-Allow-Credentials", "true")
				if (max_age) headers.set("Access-Control-Max-Age", String(max_age))
				if (allow_headers.length) headers.set("Access-Control-Allow-Headers", allow_headers.join(", "))

				return new Response("", { status: success_status, headers })
			}
		})

		return routary.http(fuel, shaft)
	}
