/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"

export const is_mobile: OrdoClientMaoka.Jabs.IsMobile = () =>
	["Android", "webOS", "iPhone", "iPad", "iPod", "BlackBerry", "IEMobile", "Opera Mini"].some(platform =>
		navigator.userAgent.includes(platform),
	)

declare global {
	namespace OrdoClientMaoka.Jabs {
		type IsMobile = Maoka.Jab<boolean>
	}
}
