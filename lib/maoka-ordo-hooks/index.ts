// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

export * from "./src/maoka-ordo-hooks.impl"
import {
	get_commands,
	get_current_file_association,
	get_current_route,
	get_fetch,
	get_file_associations,
	get_hosts,
	get_is_authenticated,
	get_is_dev,
	get_logger,
	get_metadata_query,
	get_route_params,
	get_translations,
	get_user_query,
	rx_subscription,
} from "./src/maoka-ordo-hooks.impl"

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
	current_file_association: get_current_file_association,
	file_associations: get_file_associations,
}
