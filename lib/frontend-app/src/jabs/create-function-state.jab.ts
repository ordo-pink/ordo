import { type TMaokaJab } from "@ordo-pink/maoka"

import { type TFunctionStateSource } from "./create-function-state-source.jab"

export const create_function_state =
	(fid: symbol, source: TFunctionStateSource): TMaokaJab<Ordo.CreateFunction.State> =>
	() => ({
		commands: source.get_commands(fid),
		content_query: source.get_content_query(fid),
		fetch: source.get_fetch(fid),
		file_associations$: source.get_file_associations(fid),
		logger: source.get_logger(fid),
		metadata_query: source.get_metadata_query(fid),
		router$: source.get_router(fid),
		translate: source.translate,
		user_query: source.get_user_query(fid),
	})
