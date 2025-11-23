/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Hunt } from "@ordo-pink/oss-hunt"
import type { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { context } from "../sdk-client-maoka.impl"

/**
 * @state
 */
export const hunter: Maoka.Jab<OrdoClient.Command.Hunter> = ({ use }) => {
	const state = use(context.consume)

	return state.hunter
}

export const track_on_create: OrdoClientMaoka.Jabs.TrackOnCreate =
	(p, g) =>
	({ use }) => {
		const state = use(context.consume)

		if (!state || !state.hunter) throw new Error("Maoka context is not yet initialized. Do 'context.provide' before tracking.")

		const release = state.hunter.track(p, g)

		use(maoka_dom.jabs.onunmount(release))
	}

export const track_on_mount: OrdoClientMaoka.Jabs.TrackOnMount =
	(p, g) =>
	({ use }) => {
		const state = use(context.consume)

		if (!state || !state.hunter) throw new Error("Maoka context is not yet initialized. Do 'context.provide' before tracking.")

		const handle_onmount = () => state.hunter.track(p, g)

		use(maoka_dom.jabs.onmount(handle_onmount))
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
