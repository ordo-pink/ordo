/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/maoka"

export const is_mobile_jab: Maoka.Jab<boolean> = () =>
	["Android", "webOS", "iPhone", "iPad", "iPod", "BlackBerry", "IEMobile", "Opera Mini"].some(platform =>
		navigator.userAgent.includes(platform),
	)
