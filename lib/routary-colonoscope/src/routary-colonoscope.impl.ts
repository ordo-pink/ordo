/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type TBearing, type TRoutary, type TShaft } from "@ordo-pink/routary"
import { colonoscope, is_colonoscopy_doctor } from "@ordo-pink/colonoscope"

export const handle_routary_with_colonoscope: <$TChamber>(
	chamber: $TChamber,
	shaft: TShaft<$TChamber>,
) => TRoutary<$TChamber>["start"] = (chamber, shaft) => crown_gear => (req, server) => {
	const current_bearing = req.method as TBearing
	let current_gasket = new URL(req.url).pathname
	if (current_gasket.endsWith("/") && current_gasket.length > 1) current_gasket = current_gasket.slice(0, -1)
	let params = {} as Record<string, string>

	if (!shaft[current_bearing]) return crown_gear({ req, params, server, ...chamber })

	const fitting_gasket = Object.keys(shaft[current_bearing]).find(bearing => {
		if (is_colonoscopy_doctor(bearing)) {
			const colonoscopy = colonoscope(bearing, current_gasket)

			if (!colonoscopy) return false

			params = colonoscopy
			return true
		}

		return bearing === current_gasket
	})

	if (!fitting_gasket) return crown_gear({ req, params, server, ...chamber })

	return shaft[current_bearing][fitting_gasket]({ req, params, server, ...chamber })
}
