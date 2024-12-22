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

	logger.debug("🟢 Initialised router.")

	router$.marry(({ current_route }, is_update) => {
		if (is_update) history.pushState(null, "", current_route.href)
	})

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
