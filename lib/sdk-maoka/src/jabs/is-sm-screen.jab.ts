/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import { CLIENT } from "@ordo-pink/sdk-client"
import { core_sdk } from "@ordo-pink/sdk-core"

export const is_sm_screen_jab$: Maoka.Jab<() => boolean> = ({ use }) => {
	const is_sm = core_sdk.fns.lt(CLIENT.SM_SCREEN_BREAKPOINT)

	let value: boolean = is_sm(window.innerWidth)

	use(
		maoka_dom.jabs.onmount(() => {
			const handle_resize = () => {
				const is_sm_screen = is_sm(window.innerWidth)

				if (value !== is_sm_screen) {
					value = is_sm_screen
					use(maoka_dom.jabs.refresh$)
				}
			}

			window.addEventListener("resize", handle_resize)

			return () => window.removeEventListener("resize", handle_resize)
		}),
	)

	return () => value
}
