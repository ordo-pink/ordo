/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const is_sm_screen$: OrdoClientMaoka.Jabs.IsSmScreen$ = ({ use, refresh$ }) => {
	const is_sm = ordo.fns.lt(ORDO_CLIENT.SM_SCREEN_BREAKPOINT)

	let value: boolean = is_sm(window.innerWidth)

	use(
		maoka_dom.jabs.onmount(() => {
			const handle_resize = () => {
				const is_sm_screen = is_sm(window.innerWidth)

				if (value !== is_sm_screen) {
					value = is_sm_screen
					refresh$()
				}
			}

			window.addEventListener("resize", handle_resize)

			return () => window.removeEventListener("resize", handle_resize)
		}),
	)

	return () => value
}

declare global {
	namespace OrdoClientMaoka.Jabs {
		type IsSmScreen$ = Maoka.Jab<() => boolean>
	}
}
