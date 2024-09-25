// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export * from "./src/maoka-ordo-hooks.impl"
import {
	computed,
	get_commands,
	get_current_file_association,
	get_current_route,
	get_fetch,
	get_file_associations,
	get_hosts,
	get_is_authenticated,
	get_is_dev,
	get_logger,
	get_metadata_ancestors,
	get_metadata_by_fsid,
	get_metadata_children,
	get_metadata_query,
	get_route_params,
	get_translations,
	get_user_query,
	rx_subscription,
	state,
	subscription,
} from "./src/maoka-ordo-hooks.impl"
import { Result } from "@ordo-pink/result"
import { keys_of } from "@ordo-pink/tau"

export const OrdoHooks = {
	commands: get_commands,
	current_route: get_current_route,
	fetch: get_fetch,
	hosts: get_hosts,
	is_authenticated: get_is_authenticated,
	is_dev: get_is_dev,
	logger: get_logger,
	metadata_query: get_metadata_query,
	route_params: get_route_params,
	translations: get_translations,
	user_query: get_user_query,
	rx_subscription,
	subscription,
	current_file_association: get_current_file_association,
	file_associations: get_file_associations,
	computed,
	state,
	metadata: {
		by_fsid: get_metadata_by_fsid,
		ancestors: get_metadata_ancestors,
		children: get_metadata_children,
	},
}

export const Ordo = {
	Hooks: OrdoHooks,
	Ops: {
		get_route_params: (route: Client.Router.Route | null) =>
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
}
