/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka_dom } from "@ordo-pink/maoka"

export const listen_jab =
	<$Element extends HTMLElement, $Event extends keyof $Element>(
		event: $Event extends `on${string}` ? $Event : never,
		f: $Element[$Event],
	): Maoka.Jab =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => ((n.value as any)[event] = f)))

export const listen_global_event_jab =
	<$Key extends keyof DocumentEventMap>(key: $Key, f: (event: DocumentEventMap[$Key]) => void): Maoka.Jab =>
	({ use }) => {
		const handle_mount = () => {
			document.addEventListener(key, f)

			return () => document.removeEventListener(key, f)
		}

		use(maoka_dom.jabs.onmount(handle_mount))
	}
