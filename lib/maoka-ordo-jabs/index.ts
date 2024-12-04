// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Maoka, TMaokaChildren, TMaokaJab } from "@ordo-pink/maoka"
import { Result } from "@ordo-pink/result"
import { keys_of } from "@ordo-pink/tau"

import {
	computed,
	from$,
	get_commands,
	get_content_query,
	get_current_file_association$,
	get_current_route$,
	get_fetch,
	get_file_associations$,
	get_hosts,
	get_is_authenticated$,
	get_is_dev,
	get_logger,
	get_metadata_query,
	get_route_params,
	get_translations,
	get_user_query,
	ordo_context,
	subscription,
} from "./src/maoka-ordo-jabs.impl"
import { get_ancestors, get_by_fsid, get_children, get_descendents } from "./src/metadata-jabs.impl"

export const MaokaOrdo = {
	Jabs: {
		Commands: {
			get: get_commands,
			add:
				<$TKey extends Ordo.Command.Name>(
					name: $TKey,
					handler: Ordo.Command.TCommandHandler<Ordo.Command.Record[$TKey]>,
				): TMaokaJab =>
				({ use, on_unmount }) => {
					const commands = use(MaokaOrdo.Jabs.Commands.get)
					commands.on(name, handler)
					on_unmount(() => commands.off(name, handler))
				},
		},
		CurrentRoute$: get_current_route$,
		Fetch: get_fetch,
		Hosts: get_hosts,
		IsAuthenticated$: get_is_authenticated$,
		IsDev: get_is_dev,
		Logger: get_logger,
		MetadataQuery: get_metadata_query,
		ContentQuery: get_content_query,
		Translations: get_translations,
		UserQuery: get_user_query,
		subscribe: subscription,
		CurrentFileAssociation$: get_current_file_association$,
		FileAssociations$: get_file_associations$,
		RouteParams: get_route_params,
		ContextMenu: {
			add:
				(item: Ordo.ContextMenu.Item): TMaokaJab =>
				({ use, on_unmount }) => {
					const commands = use(MaokaOrdo.Jabs.Commands.get)
					commands.emit("cmd.application.context_menu.add", item)
					on_unmount(() => commands.emit("cmd.application.context_menu.remove", item.command))
				},
		},
		from$,
		computed,
		Metadata: {
			get_descendents,
			get_ancestors,
			get_children,
			get_by_fsid,
		},
	},
	Ops: {
		get_route_params: (route: Ordo.Router.Route | null) =>
			Result.FromNullable(route)
				.pipe(Result.ops.chain(route => Result.FromNullable(route.params)))
				.pipe(
					Result.ops.map(params =>
						keys_of(params).reduce(
							(acc, key) => ({
								...acc,
								[key]: params[key] ? decodeURIComponent((params as any)[key]) : void 0,
							}),
							{} as Record<string, string | undefined>,
						),
					),
				),
	},
	Context: ordo_context,
	Components: {
		WithCtx: (ctx: Ordo.CreateFunction.Params, children: () => TMaokaChildren) =>
			Maoka.create("div", ({ use }) => {
				use(MaokaOrdo.Context.provide(ctx))
				return children
			}),
		WithCtxCurry: (ctx: Ordo.CreateFunction.Params) => (children: () => TMaokaChildren) =>
			MaokaOrdo.Components.WithCtx(ctx, children),
	},
}
