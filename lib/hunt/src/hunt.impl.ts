/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Zags, create_zags } from "@ordo-pink/zags"
import { deep_equals } from "@ordo-pink/deep-equals"

import { Hunt } from "./hunt.types.ts"

/** @see {@link Hunt.Module} */
export const hunt: Hunt.Module = {
	/** @see {@link Hunt.Begin } */
	begin: <$Preys extends Record<string, unknown>>() => {
		const hunt$ = create_zags<Hunt.State<$Preys>>({ barrage: [], gun_storage: {} })
		hunt$.marry(internal.handle_barrage_updates(hunt$))

		return { shoot: internal.shoot(hunt$), track: internal.track(hunt$) }
	},
}

/** @ignore */
namespace internal {
	export const handle_barrage_updates =
		<$Preys extends Record<string, unknown>>(hunt$: Zags.Instance<Hunt.State<$Preys>>) =>
		({ barrage, gun_storage }: Hunt.State<$Preys>) => {
			for (const shot of barrage) {
				const guns = gun_storage[shot.prey as string]

				if (guns) {
					hunt$.update("barrage", shots => shots.filter(is_different_shot(shot)))

					Promise.all(guns.map(gun => gun(shot.bullet)))
						.then(() => shot.callback())
						.catch(shot.callback)
				} else {
					hunt$.update("barrage", shots => shots.filter(is_different_prey(shot)))
				}
			}
		}

	export const is_shot = <$Preys extends Record<string, unknown>>(x: any): x is Hunt.Shot<$Preys> =>
		!!x && typeof x === "object" && typeof x.prey === "string" && x.bullet !== undefined

	export const shoot =
		<$Preys extends Record<string, unknown>>(hunt$: Zags.Instance<Hunt.State<$Preys>>): Hunt.Shoot<$Preys> =>
		(prey, bullet) => {
			const result_zags = create_zags<{ error?: unknown; status: internal.SHOT_STATUS }>({
				error: void 0,
				status: internal.SHOT_STATUS.PENDING,
			})

			const callback = (error?: unknown) => {
				result_zags.replace(() => ({
					error,
					status: error === void 0 ? internal.SHOT_STATUS.FULFILLED : internal.SHOT_STATUS.REJECTED,
				}))

				return error === void 0 ? Promise.resolve() : Promise.reject(error)
			}

			hunt$.update("barrage", shots => [...shots, { prey, bullet, callback }])

			return () =>
				new Promise((resolve, reject) => {
					const divorce = result_zags.marry((state, is_update) => {
						if (!is_update || state.status === internal.SHOT_STATUS.PENDING) return

						divorce()

						if (state.status === internal.SHOT_STATUS.REJECTED) reject(state.error)
						else resolve()
					})
				})
		}

	export const track =
		<$Preys extends Record<string, unknown>>(hunt$: Zags.Instance<Hunt.State<$Preys>>): Hunt.Track<$Preys> =>
		(prey, new_gun) => {
			hunt$.update("gun_storage", storage => {
				const guns = storage[prey as string]

				if (!guns) {
					storage[prey as string] = [new_gun]
				} else if (!guns.some(gun => gun.toString() === new_gun.toString())) {
					storage[prey as string].unshift(new_gun)
				}

				return storage
			})

			return () => {
				hunt$.update("gun_storage", storage => {
					if (!storage[prey as string]) return storage

					storage[prey as string] = storage[prey as string].filter(f => f.toString() !== new_gun.toString())

					return storage
				})
			}
		}

	export const is_different_shot =
		<$Preys extends Record<string, unknown>>(shot: Hunt.Shot<$Preys>) =>
		(the_shot: Hunt.Shot<$Preys>) =>
			the_shot.prey !== shot.prey || !deep_equals(the_shot.bullet, shot.bullet)

	export enum SHOT_STATUS {
		PENDING,
		FULFILLED,
		REJECTED,
	}

	export const is_different_prey =
		<$Preys extends Record<string, unknown>>(shot: Hunt.Shot<$Preys>) =>
		(the_shot: Hunt.Shot<$Preys>) =>
			the_shot.prey !== shot.prey
}
