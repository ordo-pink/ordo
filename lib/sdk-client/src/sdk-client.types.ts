/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Aist } from "@ordo-pink/oss-aist"
import type { I18n } from "@ordo-pink/oss-i18n"
import type { Zags } from "@ordo-pink/oss-zags"

declare global {
	namespace OrdoClient {
		export type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>
		export type Query = Zags.ReadableInstance<Aist.State & I18n.State & OrdoClient.Activity.State & OrdoClient.Data.State>
	}
}

export {}
