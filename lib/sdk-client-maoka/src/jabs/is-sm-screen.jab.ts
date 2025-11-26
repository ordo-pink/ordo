/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"

import { listen_global_event } from "./listen.jab"

export const is_sm_screen$: Maoka.Jab<() => boolean> = ({ use, refresh$ }) => {
	let value: boolean = is_sm(window.innerWidth)

	const handle_resize = () => {
		const is_sm_screen = is_sm(window.innerWidth)

		if (value !== is_sm_screen) {
			value = is_sm_screen
			refresh$()
		}
	}

	use(listen_global_event("resize", handle_resize))

	return () => value
}

// --- Internal ---

const is_sm = ordo.fns.lt(ORDO_CLIENT.SM_SCREEN_BREAKPOINT)
