import { type FSID, Metadata, type TMetadata, type TMetadataQuery } from "@ordo-pink/data"
import { Ordo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { type TCreateFunctionContext } from "@ordo-pink/core"

import { Database } from "./components/database.component"

export const FileEditorWorkspace = (ctx: TCreateFunctionContext) => {
	return Maoka.create("div", ({ use }) => {
		use(ordo_context.provide(ctx))

		return () => [TitleSetter, Database]
	})
}

// --- Internal ---

const TitleSetter = Maoka.create("div", ({ use }) => {
	const route = use(Ordo.Hooks.current_route)
	const metadata_query = use(Ordo.Hooks.metadata_query)
	const { emit } = use(Ordo.Hooks.commands)

	return () =>
		Result.FromNullable(route.value)
			.pipe(Result.ops.chain(Ordo.Ops.get_route_params))
			.pipe(Result.ops.chain(({ fsid }) => Result.FromNullable(fsid)))
			.pipe(Result.ops.chain(check_is_fsid_valid))
			.pipe(Result.ops.chain(get_metadata_with_ancestors(metadata_query)))
			.pipe(Result.ops.map(({ metadata, ancestors }) => get_path(ancestors, metadata)))
			.cata({ Ok: p => set_title(emit, p), Err: () => set_title(emit, "TODO: Empty Editor Title") })
})

const check_is_fsid_valid = (str: string) =>
	Result.If(Metadata.Validations.is_fsid(str), { T: () => str as FSID })

const get_metadata_with_ancestors = (metadata_query: TMetadataQuery) => (fsid: FSID) =>
	Result.Merge({
		metadata: metadata_query.get_by_fsid(fsid).pipe(Result.ops.chain(Result.FromOption)),
		ancestors: metadata_query.get_ancestors(fsid),
	})

const set_title = (emit: Client.Commands.Commands["emit"], title: string) =>
	emit("cmd.application.set_title", {
		status_bar_title: title,
		window_title: `${title} | File Editor`,
	})

// TODO: Move to metadata utils
const get_path = (ancestors: TMetadata[], metadata: TMetadata) =>
	Switch.OfTrue()
		.case(ancestors.length > 0, () =>
			ancestors
				.map(ancestor => ancestor.get_name())
				.join(" / ")
				.concat(" / ")
				.concat(metadata.get_name()),
		)
		.default(() => metadata.get_name())
