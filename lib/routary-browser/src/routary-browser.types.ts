/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Zags } from "@ordo-pink/zags"

export namespace RoutaryBrowser {
	export const DEFAULT_STATE: RoutaryBrowser.State = { hash: "", pathname: "/", search: "" }

	export type State = {
		hash: string
		pathname: string
		search: string
	}

	export type Instance = {
		$: Zags.Instance<RoutaryBrowser.State>
		destroy: () => void
		set_hash: (hash: string) => void
		set_pathname: (pathname: string) => void
		set_search: (search: string) => void
		set_search_params: (params: Record<string, string>) => void
	}

	export type Module = (window: Window) => RoutaryBrowser.Instance
}
