/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Aist } from "@ordo-pink/oss-aist"

declare global {
	interface cmd {
		router: {
			set_hash: { args: Aist.Hash }
			set_href: { args: string }
			set_pathname: { args: Aist.Pathname }
			set_search: { args: Aist.Search | Record<string, string> }
		}
	}
}
