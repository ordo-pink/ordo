import { KnownFunctions } from "@ordo-pink/frontend-known-functions"

import { TCreateFunctionFn } from "./types"

export const create_function: TCreateFunctionFn =
	(name, permissions, callback) =>
	({
		get_commands,
		get_current_route,
		get_hosts,
		get_is_authenticated,
		get_logger,
		metadata_query,
		user_query,
	}) => {
		const fid = KnownFunctions.register(name, permissions)

		if (!fid) return

		const context = {
			fid,
			get_commands: get_commands(fid),
			get_logger: get_logger(fid),
			get_current_route: get_current_route(fid),
			get_hosts: get_hosts(fid),
			get_is_authenticated: get_is_authenticated(fid),
			metadata_query,
			user_query,
		}

		return callback(context)
	}
