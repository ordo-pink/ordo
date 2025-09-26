/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, maoka } from "@ordo-pink/oss-maoka"
import type { Hunt } from "@ordo-pink/oss-hunt"

import { context } from "../sdk-client-maoka.impl"

export const track_on_create: OrdoClientMaoka.Jabs.TrackOnCreate =
	(p, g) =>
	({ use }) => {
		const state = use(context.consume)

		if (!state || !state.hunter) throw new Error("Maoka context is not yet initialized. Do 'context.provide' before tracking.")

		const release = state.hunter.track(p, g)

		use(maoka.dom.jabs.onunmount(release))
	}

export const track_on_mount: OrdoClientMaoka.Jabs.TrackOnMount =
	(p, g) =>
	({ use }) => {
		const state = use(context.consume)

		if (!state || !state.hunter) throw new Error("Maoka context is not yet initialized. Do 'context.provide' before tracking.")

		const handle_onmount = () => state.hunter.track(p, g)

		use(maoka.dom.jabs.onmount(handle_onmount))
	}

declare global {
	namespace OrdoClientMaoka.Jabs {
		type TrackOnCreate = <$Prey extends keyof Hunt.ToPreys<OrdoClient.Command.Preys>>(
			prey: $Prey,
			gun: OrdoClient.Command.GunFor<$Prey>,
		) => Maoka.Jab

		type TrackOnMount = <$Prey extends keyof Hunt.ToPreys<OrdoClient.Command.Preys>>(
			prey: $Prey,
			gun: OrdoClient.Command.GunFor<$Prey>,
		) => Maoka.Jab
	}
}
