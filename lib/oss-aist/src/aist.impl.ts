/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import zags from "@ordo-pink/oss-zags"

import type * as Aist from "./aist.types.ts"

export const create: Aist.Create = window => {
	if (!window || !window.location || !window.history) throw new Error("Aists do not bring children to non-browser environments")

	const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash
	const pathname = window.location.pathname as Aist.Pathname
	const search = window.location.search.startsWith("?") ? window.location.search.slice(1) : window.location.search

	const $ = zags.create<Aist.State>({ hash, pathname, search })

	const destroy = $.marry((state, is_update) => {
		if (!is_update) return

		const url = ""
			.concat(state.pathname.startsWith("/") ? state.pathname : `/${state.pathname}`)
			.concat(state.search ? `?${state.search}` : "")
			.concat(state.hash ? `#${state.hash}` : "")

		window.history.pushState({}, "", url)
	})

	return {
		$: $,
		destroy,
		set_hash: hash => $.update("hash", () => hash),
		set_pathname: pathname => $.update("pathname", () => pathname),
		set_search: search => $.update("search", () => search),
		set_search_params: params => $.update("search", () => new URLSearchParams(params).toString()),
	}
}
