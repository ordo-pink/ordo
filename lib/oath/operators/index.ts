// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { bichain_oath } from "./bichain"
import { bimap_oath } from "./bimap"
import { bitap_oath } from "./bitap"
import { chain_oath } from "./chain"
import { map_oath } from "./map"
import { rejected_chain_oath } from "./rejected-chain"
import { rejected_map_oath } from "./rejected-map"
import { rejected_tap_oath } from "./rejected-tap"
import { swap_oath } from "./swap"
import { tap_oath } from "./tap"

export * from "./bichain"
export * from "./bimap"
export * from "./bitap"
export * from "./chain"
export * from "./map"
export * from "./rejected-chain"
export * from "./rejected-map"
export * from "./rejected-tap"
export * from "./swap"
export * from "./tap"

export const ops = {
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
