/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Aist } from "@ordo-pink/oss-aist"
import type { Colonoscope } from "@ordo-pink/oss-colonoscope"
import type { Maoka } from "@ordo-pink/oss-maoka"

/**
 * @context
 * @query router
 */
export const router_pathname$: Maoka.Jab<() => Aist.Pathname> = ({ use }) => {
	const { query } = use(ordo_client_maoka.context.consume)

	return use(ordo_client_maoka.jabs.cheat$(query, "router.pathname"))
}

/**
 * @context
 * @query router
 * @query activities.current
 */
export const route_params$: Maoka.Jab<() => Colonoscope.Results> = ({ use }) => {
	const { query } = use(ordo_client_maoka.context.consume)
	use(router_pathname$)
	const get_current_activity = use(ordo_client_maoka.jabs.cheat$(query, "activities.current"))

	return () => get_current_activity()?.params ?? null
}
