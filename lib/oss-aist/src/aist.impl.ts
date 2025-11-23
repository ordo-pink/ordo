/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import zags from "@ordo-pink/oss-zags"

import type * as Aist from "./aist.types.ts"

export const create: Aist.Create = window => {
	if (!window || !window.location || !window.history) throw new Error("Aists do not bring children to non-browser environments")

	const initial_hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash
	const initial_pathname = window.location.pathname as Aist.Pathname
	const initial_search = window.location.search.startsWith("?") ? window.location.search.slice(1) : window.location.search

	const $ = zags.create<Aist.State>({ router: { hash: initial_hash, pathname: initial_pathname, search: initial_search } })

	const push_state = window.history.pushState.bind(window.history)
	const handle_popstate = (e: PopStateEvent) => $.update("router", state => e.state ?? state)

	window.addEventListener("popstate", handle_popstate)
	window.history.pushState = state => $.update("router", () => state)

	return {
		$,
		destroy: () => {
			window.removeEventListener("popstate", handle_popstate)
			history.pushState = push_state
		},
		set_hash: hash =>
			$.update("router", state => {
				if (hash === state.hash) return state

				const url = ""
					.concat(state.pathname.startsWith("/") ? state.pathname : `/${state.pathname}`)
					.concat(state.search ? `?${state.search}` : "")
					.concat(hash ? `#${hash}` : "")

				push_state({ hash, pathname: initial_pathname, search: initial_search, url }, "", url)

				return { ...state, hash }
			}),
		set_pathname: pathname =>
			$.update("router", state => {
				if (pathname === state.pathname) return state

				const url = ""
					.concat(pathname.startsWith("/") ? pathname : `/${pathname}`)
					.concat(state.search ? `?${state.search}` : "")
					.concat(state.hash ? `#${state.hash}` : "")

				push_state({ hash: initial_hash, pathname, search: initial_search, url }, "", url)

				return { ...state, pathname }
			}),

		set_search: search =>
			$.update("router", state => {
				if (search === state.search) return state

				const url = ""
					.concat(state.pathname.startsWith("/") ? state.pathname : `/${state.pathname}`)
					.concat(search ? `?${search}` : "")
					.concat(state.hash ? `#${state.hash}` : "")

				push_state({ hash: initial_hash, pathname: initial_pathname, search, url }, "", url)

				return { ...state, search }
			}),

		set_search_params: params =>
			$.update("router", state => {
				const search = new URLSearchParams(params).toString()
				if (search === state.search) return state

				const url = ""
					.concat(state.pathname.startsWith("/") ? state.pathname : `/${state.pathname}`)
					.concat(search ? `?${search}` : "")
					.concat(state.hash ? `#${state.hash}` : "")

				push_state({ hash: initial_hash, pathname: initial_pathname, search, url }, "", url)

				return { ...state, search }
			}),
	}
}
