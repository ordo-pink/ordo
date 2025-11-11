/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Hunt } from "@ordo-pink/oss-hunt"

declare global {
	namespace OrdoClient.Command {
		export type Preys = Pick<cmd, keyof cmd>

		export type Hunter = Hunt.Instance<Preys>

		export type GunFor<$Prey extends keyof Hunt.ToPreys<Preys>> = Hunt.GunFor<Hunt.ToPreys<Preys>, $Prey>
	}
}
