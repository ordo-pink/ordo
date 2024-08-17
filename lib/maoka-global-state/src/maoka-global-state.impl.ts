// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type TInitHook } from "@ordo-pink/maoka"
import { for_each_key } from "@ordo-pink/tau"

import type * as T from "./maoka-global-state.types"

export const init_global_state = (): TInitHook<{ state: T.TStateHook }> => {
	const global_state = {} as { [K in keyof MaokaState]: MaokaState[K] }
	const listeners = {} as { [K in keyof MaokaState]: Record<string, () => void> }

	return {
		state: use => (key, initial_value, options) => {
			const internal_id = use.get_internal_id()
			const refresh = use.refresh

			if (global_state[key] == null) global_state[key] = initial_value
			if (!listeners[key]) (listeners as any)[key] = {}
			if (!listeners[key][internal_id]) (listeners as any)[key][internal_id] = refresh

			return [
				global_state[key],
				f => {
					global_state[key] = f(global_state[key])

					if (!options || options.autorefresh == null || options.autorefresh === true)
						for_each_key(listeners[key], id => listeners[key][id]())
				},
			]
		},
	}
}
