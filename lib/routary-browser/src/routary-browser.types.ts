/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Zags } from "@ordo-pink/zags"

export namespace RoutaryBrowser {
	export type State = {
		hash: string
		hostname: string
		href: string
		origin: string
		pathname: string
		port: string
		protocol: string
		search: string
	}

	export type Prey = {
		rotor: {
			open: { args: { pathname: string } }
			hash: { args: { hash: string } }
		}
	}

	export type Instance = Zags.Instance<RoutaryBrowser.State>

	export type Module = () => RoutaryBrowser.Instance
}
