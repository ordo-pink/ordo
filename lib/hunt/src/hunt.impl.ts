/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { TZags, zags } from "@ordo-pink/zags" // TODO Use new types, publish to jsr
import { deep_equals } from "@ordo-pink/deep-equals"

import { Hunt } from "./hunt.types.ts"

export const hunt: Hunt.Module = {
	begin: () => {
		const hunt$ = zags.of<Hunt.State>({ barrage: [], gun_storage: {} })
		hunt$.marry(internal.handle_barrage_updates(hunt$))

		return { track: internal.track(hunt$), putdown: internal.putdown(hunt$), shoot: internal.shoot(hunt$) }
	},
}

// --- Internal ---

const internal = {
	handle_barrage_updates:
		(hunt$: TZags<Hunt.State>) =>
		({ barrage, gun_storage }: Hunt.State) => {
			for (const shot of barrage) {
				const bullet = internal.is_loaded_shot_guard(shot) ? shot.bullet : undefined
				const guns = gun_storage[shot.prey]

				if (guns) {
					hunt$.update("barrage", state => {
						const target_is_loaded = internal.is_loaded_shot_guard(shot)

						return state.filter(shot => {
							const current_is_loaded = internal.is_loaded_shot_guard(shot)

							const both_are_empty = !target_is_loaded && !current_is_loaded
							const both_are_loaded = target_is_loaded && current_is_loaded

							const is_same_prey = shot.prey === shot.prey

							return !(is_same_prey && (both_are_empty || (both_are_loaded && deep_equals(shot.bullet, shot.bullet))))
						})
					})

					guns.forEach(gun => gun(bullet))
				}
			}
		},

	is_loaded_shot_guard: (x: any): x is Hunt.LoadedShot =>
		!!x && typeof x === "object" && typeof x.prey === "string" && (x as Hunt.LoadedShot).bullet !== undefined,

	putdown:
		(hunt$: TZags<Hunt.State>): Hunt.PutDown =>
		(prey, gun) =>
			void hunt$.update("gun_storage", state => {
				if (!state[prey]) return state

				state[prey] = state[prey].filter(f => f.toString() !== gun.toString())

				return state
			}),

	shoot:
		(hunt$: TZags<Hunt.State>): Hunt.Shoot =>
		(prey, bullet) =>
			void hunt$.update("barrage", state => [...state, { prey, bullet }]),

	track:
		(hunt$: TZags<Hunt.State>): Hunt.Track =>
		(prey, new_gun) =>
			void hunt$.update("gun_storage", state => {
				const guns = state[prey]

				if (!guns) {
					state[prey] = [new_gun]
				} else if (!guns.some(gun => gun.toString() === new_gun.toString())) {
					state[prey].unshift(new_gun)
				}

				return state
			}),
}
