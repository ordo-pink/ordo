/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import { core } from "@ordo-pink/sdk-core"

export const is_sm_screen$: Maoka.Jab<() => boolean> = ({ use }) => {
	const is_sm = core.fns.lt(ordo_client.SM_SCREEN_BREAKPOINT)

	let value: boolean = is_sm(window.innerWidth)

	use(
		maoka.dom.jabs.onmount(() => {
			const handle_resize = () => {
				const is_sm_screen = is_sm(window.innerWidth)

				if (value !== is_sm_screen) {
					value = is_sm_screen
					use(maoka.dom.jabs.refresh$)
				}
			}

			window.addEventListener("resize", handle_resize)

			return () => window.removeEventListener("resize", handle_resize)
		}),
	)

	return () => value
}
