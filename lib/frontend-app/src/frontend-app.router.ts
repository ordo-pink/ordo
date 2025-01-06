/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { call_once, deep_equals } from "@ordo-pink/tau"
import { colonoscope, is_colonoscopy_doctor } from "@ordo-pink/colonoscope"
import { R } from "@ordo-pink/result"
import { ZAGS } from "@ordo-pink/zags"

import { ordo_app_state } from "../app.state"

export const init_router = call_once(() => {
	const { logger, commands, known_functions } = ordo_app_state.zags.unwrap()

	logger.debug("🟡 Initialising router...")

	commands.on("cmd.application.router.navigate", ({ url, new_tab = false }) => {
		if (new_tab) return window.open(url, "_blank")

		const routes = ordo_app_state.zags.select("router.routes")

		for (const route of Object.keys(routes)) {
			if (is_colonoscopy_doctor(route)) {
				const params = colonoscope(route, url)

				if (!params) continue

				ordo_app_state.zags.update("functions.current_activity", () => routes[route])
				ordo_app_state.zags.update("router.current_route", () => create_route(url, params))
				return
			}

			if (url === route) {
				ordo_app_state.zags.update("functions.current_activity", () => routes[route])
				ordo_app_state.zags.update("router.current_route", () => create_route(url, {}))
				return
			}
		}

		ordo_app_state.zags.update("functions.current_activity", () => void 0)
		ordo_app_state.zags.update("router.current_route", () => create_route(url, {}))
	})

	commands.on("cmd.application.router.open_external", ({ url, new_tab = true }) =>
		window.open(url, new_tab ? "_blank" : "_self"),
	)

	const divorce_router = ordo_app_state.zags.cheat("router.current_route", (current_route, is_update) => {
		if (is_update && current_route) history.pushState(null, "", current_route.href)
	})

	const divorce_activities_updates = ordo_app_state.zags.cheat("functions.activities", activities => {
		const routes = ordo_app_state.zags.select("router.routes")
		const routes_copy = { ...routes }
		const current_activity = ordo_app_state.zags.select("functions.current_activity")
		const current_route = ordo_app_state.zags.select("router.current_route")

		for (const activity of activities) {
			for (const route of activity.routes) {
				if (!routes[route]) routes[route] = activity.name
			}
		}

		if (!deep_equals(routes, routes_copy)) ordo_app_state.zags.update("router.routes", () => routes)

		if (!current_activity) {
			const activity = activities.find(activity =>
				activity.routes.some(route =>
					is_colonoscopy_doctor(route) ? colonoscope(route, current_route.pathname) : route === current_route.pathname,
				),
			)

			if (activity) commands.emit("cmd.application.router.navigate", { url: current_route.pathname })
		}
	})

	window.addEventListener("beforeunload", () => {
		divorce_activities_updates()
		divorce_router()
	})

	logger.debug("🟢 Initialised router.")

	return {
		get_router: (fid: symbol) =>
			R.If(known_functions.has_permissions(fid, { queries: ["application.router"] }))
				.pipe(
					R.ops.map(() => {
						const router$ = ZAGS.Of<{ current_route: Ordo.Router.Route; routes: Record<string, string> }>({
							current_route: null as never,
							routes: {},
						})
						ordo_app_state.zags.cheat("router", router$.replace)
						return router$
					}),
				)
				.cata(
					R.catas.or_else(
						() => "Router permission RRR. Did you forget to request query permission 'application.router'?" as never,
					),
				),
	}
})

export const create_route = (href: string, params: Record<string, string>): Ordo.Router.Route => {
	const url = new URL(href, document.location.origin)

	return {
		host: url.host,
		hostname: url.hostname,
		href: url.href,
		origin: url.origin,
		password: url.password,
		pathname: url.pathname as `/${string}`,
		port: url.port,
		protocol: url.protocol as `${string}:`,
		search: url.search,
		username: url.username,
		params,
	}
}
