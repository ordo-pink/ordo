/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Routary, type TBearing, type TGasket, type TGear, type TIntake } from "@ordo-pink/routary"

import { type TRoutaryCORS } from "./routary-cors.types"

export const routary_cors: TRoutaryCORS =
	({ allow_origin, allow_headers = [], max_age = 0, success_status = 204 }) =>
	(chamber, shaft) => {
		const options = {} as Record<string, string[]>

		Object.keys(shaft).forEach(bearing => {
			if (bearing === "OPTIONS") return

			Object.keys(shaft[bearing as TBearing] as Record<TGasket, TGear<Record<string, unknown>>>).forEach(gasket => {
				if (!options[gasket]) options[gasket] = ["OPTIONS"]
				options[gasket].push(bearing)
			})
		})

		if (!shaft.OPTIONS) shaft.OPTIONS = {}

		Object.keys(options).forEach(gasket => {
			shaft.OPTIONS![gasket] = (intake: TIntake<Record<string, unknown>>) => {
				if (typeof allow_origin === "string") allow_origin = [allow_origin]
				const origin = intake.req.headers.get("origin")

				if (!origin || !allow_origin.includes(origin)) return new Response("", { status: 404 })

				const headers = {
					"Access-Control-Allow-Origin": origin,
					"Access-Control-Allow-Methods": options[gasket].join(", "),
				} as Record<string, string>

				if (max_age) headers["Access-Control-Max-Age"] = String(max_age)
				if (allow_headers.length) headers["Access-Control-Allow-Headers"] = allow_headers.join(", ")

				return new Response("", { status: success_status, headers })
			}
		})

		return Routary.Of(chamber, shaft)
	}
