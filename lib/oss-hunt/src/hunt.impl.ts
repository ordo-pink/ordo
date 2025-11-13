/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Zags, zags } from "@ordo-pink/oss-zags"
import deep_equals from "@ordo-pink/oss-deep-equals"

import type * as Hunt from "./hunt.types.ts"

/** @see {@link Hunt.Create } */
export const create: Hunt.Create = debug => {
	const hunt$ = zags.create<Hunt.State<any>>({ barrage: [], gun_storage: {} })
	hunt$.marry(handle_barrage_updates(hunt$, debug))

	return { shoot: shoot(hunt$, debug), track: track(hunt$, debug) }
}

const handle_barrage_updates =
	<$Preys extends Hunt.BasePreys>(hunt$: Zags.Instance<Hunt.State<$Preys>>, debug?: (...message: any[]) => void) =>
	({ barrage, gun_storage }: Hunt.State<$Preys>) => {
		for (const shot of barrage) {
			const guns = gun_storage[shot.prey as string]

			if (guns) {
				hunt$.update("barrage", shots => shots.filter(is_different_shot(shot)))

				Promise.all(guns.map(gun => gun(shot.bullet)))
					.then(() => shot.callback())
					.then(() => debug && debug("Hit", `"${shot.prey as string}"`, "with", shot.bullet))
					.catch(shot.callback)
			}
		}
	}

const shoot =
	<$Preys extends Record<string, unknown>>(
		hunt$: Zags.Instance<Hunt.State<$Preys>>,
		debug?: (...message: any[]) => void,
	): Hunt.Shoot<$Preys> =>
	(prey, bullet) => {
		debug && debug("Fired shot", `"${prey as string}"`, "with", bullet)

		const result_zags = zags.create<{ error?: unknown; status: SHOT_STATUS }>({
			error: void 0,
			status: SHOT_STATUS.PENDING,
		})

		const callback = (error?: unknown) => {
			result_zags.replace(() => ({
				error,
				status: error === void 0 ? SHOT_STATUS.FULFILLED : SHOT_STATUS.REJECTED,
			}))

			return error === void 0 ? Promise.resolve() : Promise.reject(error)
		}

		hunt$.update("barrage", shots => [...shots, { prey, bullet, callback }])

		return {
			to_promise: () =>
				new Promise((resolve, reject) => {
					const divorce = result_zags.marry((state, is_update) => {
						if (!is_update || state.status === SHOT_STATUS.PENDING) return

						divorce()

						if (state.status === SHOT_STATUS.REJECTED) reject(state.error)
						else resolve()
					})
				}),
		}
	}

const track =
	<$Preys extends Record<string, unknown>>(
		hunt$: Zags.Instance<Hunt.State<$Preys>>,
		debug?: (...message: any[]) => void,
	): Hunt.Track<$Preys> =>
	(prey, new_gun) => {
		debug && debug("Started tracking", `"${String(prey)}"`)

		hunt$.update("gun_storage", storage => {
			const guns = storage[prey as string]

			if (!guns) {
				storage[prey as string] = [new_gun]
			} else if (!guns.some(gun => gun.toString() === new_gun.toString())) {
				storage[prey as string].unshift(new_gun)
			}

			const barrage = hunt$.select("barrage")

			hunt$.update("barrage", () => barrage.filter(shot => shot.prey !== prey))
			barrage.filter(shot => shot.prey === prey).forEach(shot => shoot(hunt$)(prey, shot.bullet))

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

const is_different_shot =
	<$Preys extends Record<string, unknown>>(shot: Hunt.Shot<$Preys>) =>
	(the_shot: Hunt.Shot<$Preys>) =>
		the_shot.prey !== shot.prey || !deep_equals(the_shot.bullet, shot.bullet)

enum SHOT_STATUS {
	PENDING,
	FULFILLED,
	REJECTED,
}
