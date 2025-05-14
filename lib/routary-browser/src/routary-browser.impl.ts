/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { create_zags } from "@ordo-pink/zags"

import { RoutaryBrowser } from "./routary-browser.types"

export const create_routary_browser: RoutaryBrowser.Module = window => {
	if (!window || !window.location) throw new Error("Cannot create routary_browser in non-browser environment")

	const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash
	const search = window.location.search.startsWith("?") ? window.location.search.slice(1) : window.location.search

	internal.rotor$.replace(() => ({ hash, pathname: window.location.pathname, search }))

	const destroy = internal.rotor$.marry((state, is_update) => {
		if (!is_update) return

		const url = ""
			.concat(state.pathname.startsWith("/") ? state.pathname : `/${state.pathname}`)
			.concat(state.search ? `?${state.search}` : "")
			.concat(state.hash ? `#${state.hash}` : "")

		window.history.pushState({}, "", url)
	})

	return {
		$: internal.rotor$,
		destroy,
		set_hash: hash => internal.rotor$.update("hash", () => hash),
		set_pathname: pathname => internal.rotor$.update("pathname", () => pathname),
		set_search: search => internal.rotor$.update("search", () => search),
		set_search_params: params => internal.rotor$.update("search", () => new URLSearchParams(params).toString()),
	}
}

namespace internal {
	export const rotor$ = create_zags<RoutaryBrowser.State>(RoutaryBrowser.DEFAULT_STATE)
}
