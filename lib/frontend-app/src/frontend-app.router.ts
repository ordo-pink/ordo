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

import { ZAGS } from "@ordo-pink/zags"

import { ordo_app_state } from "../app.state"

export const init_router = () => {
	const { logger, commands } = ordo_app_state.zags.unwrap()

	const window_open = window.open

	window.open = undefined!

	commands.on("cmd.application.router.navigate", ({ url, new_tab = false }) => {
		if (new_tab) window_open(url, "_blank")?.focus()
		else router$.update("current_route", () => create_route(url))
	})

	router$.marry(({ current_route }, is_update) => {
		if (is_update) history.pushState(null, "", current_route.href)
	})

	logger.debug("🟢 Initialised router.")

	return router$
}

const create_route = (href: string): Ordo.Router.Route => {
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
		params: url.searchParams,
	}
}

const router$ = ZAGS.Of<{ current_route: Ordo.Router.Route }>({ current_route: create_route(document.location.pathname) })
