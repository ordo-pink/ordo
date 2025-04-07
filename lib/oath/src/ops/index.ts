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

export const ops: Oath.Operators.Static = {
	and: and_op,
	ap: ap_op,
	chain: chain_op,
	bimap: bimap_op,
	fix: fix_op,
	map: map_op,
	tap: tap_op,
	rejected_map: rejected_map_op,
	rejected_tap: rejected_tap_op,
}
