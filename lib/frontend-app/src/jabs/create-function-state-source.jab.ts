import { ConsoleLogger, TLogger } from "@ordo-pink/logger"
import { type TMaokaJab } from "@ordo-pink/maoka"
import { type TZags } from "@ordo-pink/zags"

import { init_commands } from "../frontend-app.commands"
import { init_content } from "../frontend-app.content"
import { init_fetch } from "../frontend-app.fetch"
import { init_functions } from "../frontend-app.functions"
import { init_i18n } from "../frontend-app.i18n"
import { init_known_functions } from "../frontend-app.known-functions"
import { init_logger } from "../frontend-app.logger"
import { init_metadata } from "../frontend-app.metadata"
import { init_router } from "../frontend-app.router"
import { init_user } from "../frontent-app.user"

export type TFunctionStateSource = {
	get_commands: (fid: symbol) => Ordo.Command.Commands
	get_content_query: (fid: symbol) => Ordo.Content.Query
	get_fetch: (fid: symbol) => Ordo.Fetch
	get_logger: (fid: symbol) => TLogger // TODO Move TLogger to global Ordo
	get_metadata_query: (fid: symbol) => Ordo.Metadata.Query
	get_router: (fid: symbol) => TZags<{ current_route: Ordo.Router.Route; routes: Record<string, string> }>
	get_file_associations: (fid: symbol) => TZags<{ value: Ordo.FileAssociation.Instance[] }>
	get_user_query: (fid: symbol) => Ordo.User.Query
	known_functions: OrdoInternal.KnownFunctions
	translate: Ordo.I18N.TranslateFn
}

export type TCreateFunctionStateResult = {
	source: TFunctionStateSource
	repositories: { metadata: Ordo.Metadata.Repository; content: Ordo.Content.Repository }
}

export const create_function_state_source: TMaokaJab<TCreateFunctionStateResult> = () => {
	const known_functions = init_known_functions()
	const { get_logger } = init_logger(ConsoleLogger)
	const { get_fetch } = init_fetch()
	const { get_commands } = init_commands()
	const { translate } = init_i18n()
	const { get_file_associations } = init_functions()
	const { get_router } = init_router()
	const { get_user_query } = init_user()
	const { content_repository, get_content_query } = init_content()
	const { metadata_repository, get_metadata_query } = init_metadata()

	return {
		source: {
			get_commands,
			get_content_query,
			get_fetch,
			get_logger,
			get_metadata_query,
			get_router,
			get_file_associations,
			get_user_query,
			known_functions,
			translate,
		},
		repositories: { metadata: metadata_repository, content: content_repository },
	}
}
