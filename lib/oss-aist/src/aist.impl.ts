/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { create_zags } from "@ordo-pink/oss-zags"

import * as LIB from "./aist.constants.ts"
import type * as Lib from "./aist.types.ts"

export const create: Lib.Create = window => {
	if (!window || !window.location || !window.history) throw new Error("Aists do not bring children to non-browser environments")

	const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash
	const search = window.location.search.startsWith("?") ? window.location.search.slice(1) : window.location.search

	$.replace(() => ({ hash, pathname: window.location.pathname as `/${string}`, search }))

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

const $ = create_zags<Lib.State>(LIB.DEFAULT_STATE)
