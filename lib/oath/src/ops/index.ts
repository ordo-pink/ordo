/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bimap_op, map_op, rejected_map_op } from "./impl/map.impl"
import { rejected_tap_op, tap_op } from "./impl/tap.impl"
import { type Oath } from "../oath.types"
import { and_op } from "./impl/and.impl"
import { ap_op } from "./impl/ap.impl"
import { chain_op } from "./impl/chain.impl"
import { fix_op } from "./impl/fix.impl"

export * from "./impl/ap.impl"
export * from "./impl/chain.impl"
export * from "./impl/map.impl"
export * from "./impl/tap.impl"

export const ops: Oath.Ops.Static = {
	and: and_op,
	ap: ap_op,
	chain: chain_op,
	bimap: bimap_op,
	fix: fix_op,
	map: map_op,
	tap: tap_op,
	rmap: rejected_map_op,
	rtap: rejected_tap_op,
}
