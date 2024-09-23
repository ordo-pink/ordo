import { OrdoHooks, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Switch } from "@ordo-pink/switch"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { type TMetadata } from "@ordo-pink/data"
import { create } from "@ordo-pink/maoka"

import { Database } from "./components/database.component"

export const FileEditorWorkspace = (ctx: TCreateFunctionContext) => {
	return create("div", ({ use }) => {
		use(ordo_context.provide(ctx))

		const { emit } = use(OrdoHooks.commands)
		const { fsid } = use(OrdoHooks.route_params)
		const metadata = use(OrdoHooks.metadata.by_fsid(fsid))
		const ancestors = use(OrdoHooks.metadata.ancestors(fsid))
		const path = get_path(ancestors, metadata)

		emit("cmd.application.set_title", {
			status_bar_title: path,
			window_title: `${path} | File Editor`,
		})

		return Database
	})
}

// TODO: Move to metadata utils
const get_path = (ancestors: TMetadata[], metadata: TMetadata | null) =>
	Switch.OfTrue()
		.case(!metadata, () => "TODO: Empty Editor Title")
		.case(ancestors.length > 0, () =>
			ancestors
				.map(ancestor => ancestor.get_name())
				.join(" / ")
				.concat(" / ")
				.concat(metadata!.get_name()),
		)
		.default(() => metadata!.get_name())
