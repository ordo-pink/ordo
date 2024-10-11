// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

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
import { get_descendents } from "./src/metadata-jabs.impl"

export const MaokaOrdo = {
	Jabs: {
		Commands: get_commands,
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
		from$,
		computed,
		Metadata: {
			get_descendents,
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
}
