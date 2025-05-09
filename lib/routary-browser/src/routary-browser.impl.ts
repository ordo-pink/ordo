/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { create_zags } from "@ordo-pink/zags"

import { RoutaryBrowser } from "./routary-browser.types"
import { call_once } from "@ordo-pink/tau"

export const create_routary_browser: RoutaryBrowser.Module = call_once(() => {
	let href: string | undefined

	const rotor$ = create_zags<RoutaryBrowser.State>({
		hash: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		port: "",
		protocol: "",
		search: "",
	})

	const next_tick = globalThis.requestIdleCallback ?? setTimeout

	const handle_idle_callback = () => {
		const new_href = window.location.href

		if (href !== new_href) {
			href = new_href

			rotor$.each({
				hash: () => window.location.hash,
				hostname: () => window.location.hostname,
				href: () => window.location.href,
				origin: () => window.location.origin,
				pathname: () => window.location.pathname,
				port: () => window.location.port,
				protocol: () => window.location.protocol,
				search: () => window.location.search,
			})
		}

		next_tick(handle_idle_callback)
	}

	handle_idle_callback()

	return rotor$
})
