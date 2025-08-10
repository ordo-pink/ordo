/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import type { Hunt } from "@ordo-pink/oss-hunt"

import { context } from "../sdk-client-maoka.impl"

export namespace hunter_jabs {
	export const track_on_create: <$Prey extends keyof Hunt.Pouch.ToPreys<ClientSDK.Preys>>(
		prey: $Prey,
		gun: ClientSDK.GunFor<$Prey>,
	) => Maoka.Jab =
		(prey, gun) =>
		({ use }) => {
			const state = use(context.consume)

			if (!state || !state.hunter)
				throw new Error("Maoka context is not yet initialized. Do 'context.provide' before tracking.")

			const release = state.hunter.track(prey, gun)

			use(maoka_dom.jabs.onunmount(() => release()))
		}

	export const track_on_mount: <$Prey extends keyof Hunt.Pouch.ToPreys<ClientSDK.Preys>>(
		prey: $Prey,
		gun: ClientSDK.GunFor<$Prey>,
	) => Maoka.Jab =
		(prey, gun) =>
		({ use }) => {
			const state = use(context.consume)

			if (!state || !state.hunter)
				throw new Error("Maoka context is not yet initialized. Do 'context.provide' before tracking.")

			const handle_onmount = () => {
				const release = state.hunter.track(prey, gun)

				return () => release()
			}

			use(maoka_dom.jabs.onmount(handle_onmount))
		}
}
