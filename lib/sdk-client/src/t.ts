/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { RRR } from "@ordo-pink/sdk-core"

declare global {
	interface t {
		rrr: {
			codes: Record<keyof typeof RRR.TYPE, string>
		}
		loading_title: string
		f: {
			rrr: {
				not_permitted: {
					direct_zags_update: string
					fetch: string
					shot: string
				}
			}
		}
	}
}
