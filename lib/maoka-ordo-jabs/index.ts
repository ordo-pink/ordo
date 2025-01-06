/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"

import {
	get_commands,
	get_content_query,
	get_current_route$,
	get_metadata_query,
	get_route_params$,
	get_translations$,
	get_user_query,
	ordo_context,
} from "./src/maoka-ordo-jabs.impl"

export const MaokaOrdo = {
	Jabs: {
		get_commands,
		get_translations$,
		get_metadata_query,
		get_user_query,
		get_content_query,
		get_route_params$,
		get_current_route$,
	},
	Context: ordo_context,
	Components: {
		WithState: (ctx: Ordo.CreateFunction.State, children: () => TMaokaChildren) =>
			Maoka.create("div", ({ use }) => {
				use(MaokaOrdo.Context.provide(ctx))
				return children
			}),
		WithStateCurry: (ctx: Ordo.CreateFunction.State) => (children: () => TMaokaChildren) =>
			MaokaOrdo.Components.WithState(ctx, children),
	},
}
