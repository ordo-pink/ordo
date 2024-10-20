// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export * from "./bichain.ts"
export * from "./bimap.ts"
export * from "./bitap.ts"
export * from "./chain.ts"
export * from "./map.ts"
export * from "./rejected-chain.ts"
export * from "./rejected-map.ts"
export * from "./rejected-tap.ts"
export * from "./swap.ts"
export * from "./tap.ts"

import { bichain_oath } from "./bichain.ts"
import { bimap_oath } from "./bimap.ts"
import { bitap_oath } from "./bitap.ts"
import { chain_oath } from "./chain.ts"
import { map_oath } from "./map.ts"
import { rejected_chain_oath } from "./rejected-chain.ts"
import { rejected_map_oath } from "./rejected-map.ts"
import { rejected_tap_oath } from "./rejected-tap.ts"
import { swap_oath } from "./swap.ts"
import { tap_oath } from "./tap.ts"

export const ops0 = {
	bichain: bichain_oath,
	bimap: bimap_oath,
	bitap: bitap_oath,
	chain: chain_oath,
	map: map_oath,
	rejected_chain: rejected_chain_oath,
	rejected_map: rejected_map_oath,
	rejected_tap: rejected_tap_oath,
	swap: swap_oath,
	tap: tap_oath,
}
