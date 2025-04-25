/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Zags, create_zags } from "@ordo-pink/zags"
import { deep_equals } from "@ordo-pink/deep-equals"

import { Hunt } from "./hunt.types.ts"

export const hunt: Hunt.Module = {
	begin: <$Preys extends Record<string, unknown>>() => {
		const hunt$ = create_zags<Hunt.State<$Preys>>({ barrage: [], gun_storage: {} })
		hunt$.marry(internal.handle_barrage_updates(hunt$))

		return {
			putdown: internal.putdown(hunt$),
			shoot: internal.shoot(hunt$),
			track: internal.track(hunt$),
		}
	},
}

/** @ignore */
namespace internal {
	export const handle_barrage_updates =
		<$Preys extends Record<string, unknown>>(hunt$: Zags.Instance<Hunt.State<$Preys>>) =>
		({ barrage, gun_storage }: Hunt.State<$Preys>) => {
			for (const shot of barrage) {
				const bullet = internal.is_loaded_shot_guard(shot) ? shot.bullet : undefined
				const guns = gun_storage[shot.prey as string]

				if (guns) {
					hunt$.update("barrage", shots => {
						const target_is_loaded = internal.is_loaded_shot_guard(shot)

						return shots.filter(shot => {
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
		}

	export const is_loaded_shot_guard = <$Preys extends Record<string, unknown>>(x: any): x is Hunt.LoadedShot<$Preys> =>
		!!x && typeof x === "object" && typeof x.prey === "string" && (x as Hunt.LoadedShot<$Preys>).bullet !== undefined

	export const putdown =
		<$Preys extends Record<string, unknown>>(hunt$: Zags.Instance<Hunt.State<$Preys>>): Hunt.PutDown<$Preys> =>
		(prey, gun) =>
			void hunt$.update("gun_storage", storage => {
				if (!storage[prey as string]) return storage

				storage[prey as string] = storage[prey as string].filter((f: Hunt.Gun<any>) => f.toString() !== gun.toString())

				return storage
			})

	export const shoot =
		<$Preys extends Record<string, unknown>>(hunt$: Zags.Instance<Hunt.State<$Preys>>): Hunt.Shoot<$Preys> =>
		(prey, bullet) =>
			void hunt$.update("barrage", shots => [...shots, { prey, bullet }])

	export const track =
		<$Preys extends Record<string, unknown>>(hunt$: Zags.Instance<Hunt.State<$Preys>>): Hunt.Track<$Preys> =>
		(prey, new_gun) =>
			void hunt$.update("gun_storage", (storage: Record<string, Hunt.Gun<any>[]>) => {
				const guns = storage[prey as string]

				if (!guns) {
					storage[prey as string] = [new_gun]
				} else if (!guns.some((gun: Hunt.Gun<any>) => gun.toString() === new_gun.toString())) {
					storage[prey as string].unshift(new_gun)
				}

				return storage
			})
}
