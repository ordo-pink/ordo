/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"

import "@ordo-pink/sdk-client"

declare global {
	namespace OrdoClientMaoka {
		export type Context = Maoka.Context.Instance<OrdoClient.F.State>
		export type NoSpaceString<$Str extends string> = $Str extends `${string} ${string}` ? never : $Str
	}
}
