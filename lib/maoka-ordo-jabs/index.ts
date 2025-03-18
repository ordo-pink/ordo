/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, type TMaokaComponent } from "@ordo-pink/maoka"

import {
	count_metadata$,
	get_commands,
	get_content_query,
	get_current_route$,
	get_current_user$,
	get_fetch,
	get_file_associations$,
	get_logger,
	get_metadata$,
	get_metadata_by_fsid$,
	get_metadata_children$,
	get_metadata_children_count$,
	get_metadata_has_children$,
	get_metadata_incoming_links$,
	get_metadata_outgoing_links$,
	get_metadata_query,
	get_route_params$,
	get_translations$,
	get_user_query,
	happy_marriage$,
	ordo_context,
} from "./src/maoka-ordo-jabs.impl"

export const MaokaOrdo = {
	Jabs: {
		Metadata: {
			count$: count_metadata$,
			get$: get_metadata$,
			get_by_fsid$: get_metadata_by_fsid$,
			has_children$: get_metadata_has_children$,
			get_children$: get_metadata_children$,
			get_children_count$: get_metadata_children_count$,
			get_incoming_links$: get_metadata_incoming_links$,
			get_outgoing_links$: get_metadata_outgoing_links$,
		},
		User: {
			get_current$: get_current_user$,
		},
		happy_marriage$,
		get_commands,
		get_fetch,
		get_logger,
		get_content_query,
		get_current_route$,
		get_file_associations$,
		get_metadata_query,
		get_route_params$,
		get_translations$,
		get_user_query,
	},
	Context: ordo_context,
	Components: {
		WithState: (ctx: Ordo.CreateFunction.State, children: () => TMaokaComponent | Promise<TMaokaComponent>) =>
			Maoka.create("div", ({ use }) => {
				use(MaokaOrdo.Context.provide(ctx))
				return async () => children()
			}),
		WithStateCurry: (ctx: Ordo.CreateFunction.State) => (children: () => TMaokaComponent | Promise<TMaokaComponent>) =>
			MaokaOrdo.Components.WithState(ctx, children),
	},
}
