/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Zags } from "@ordo-pink/oss-zags"

export type Hash = string & {}
export type Pathname = `/${string}` & {}
export type Search = string & {}

export type State = { hash: Hash; pathname: Pathname; search: Search }

export type Stream = Zags.Instance<State>

export type Instance = {
	$: Stream
	destroy: () => void
	set_hash: (hash: Hash) => void
	set_pathname: (pathname: Pathname) => void
	set_search: (search: Search) => void
	set_search_params: (params: Record<string, string>) => void
}

export type Create = (window: Window) => Instance
