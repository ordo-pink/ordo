/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"

export const is_darwin: OrdoClientMaoka.Jabs.IsDarwin = () => navigator.appVersion.indexOf("Mac") !== -1

declare global {
	namespace OrdoClientMaoka.Jabs {
		export type IsDarwin = Maoka.Jab<boolean>
	}
}
