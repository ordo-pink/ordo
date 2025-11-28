/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { MaokaContext } from "@ordo-pink/oss-maoka-context"

import "@ordo-pink/sdk-client"

declare global {
	namespace OrdoClientMaoka {
		export type Context = MaokaContext.Instance<OrdoClient.F.GlobalState>
		export type NoSpaceString<$Str extends string> = $Str extends `${string} ${string}` ? never : $Str
	}
}
