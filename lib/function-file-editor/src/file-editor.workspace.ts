import { type FSID, Metadata, type TMetadata, TMetadataQuery } from "@ordo-pink/data"
import { OrdoHooks, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { create } from "@ordo-pink/maoka"

export const FileEditorWorkspace = (ctx: TCreateFunctionContext) => {
	return create("div", ({ use, on_mount }) => {
		use(ordo_context.provide(ctx))

		const { emit } = use(OrdoHooks.commands)
		const metadata_query = use(OrdoHooks.metadata_query)
		const { fsid } = use(OrdoHooks.route_params<"fsid">)

		// TODO: Show empty editor title
		on_mount(() => {
			R.FromNullable(fsid)
				.pipe(R.ops.chain(x => R.If(Metadata.Validations.is_fsid(x), { T: () => x as FSID })))
				.pipe(R.ops.chain(fsid => metadata_query.get_by_fsid(fsid)))
				.pipe(R.ops.chain(o => o.cata({ Some: R.Ok, None: () => R.Err("Not found") })))
				.pipe(R.ops.chain(get_path_from_metadata(metadata_query)))
				.pipe(R.ops.map(p => ({ status_bar_title: p, window_title: `${p} | File Editor` })))
				.pipe(R.ops.map(payload => emit("cmd.application.set_title", payload)))
		})

		return "HELLO"
	})
}

const get_path_from_metadata = (metadata_query: TMetadataQuery) => (metadata: TMetadata) =>
	metadata_query
		.get_ancestors(metadata.get_fsid())
		.pipe(R.ops.map(ancestors => get_path(ancestors, metadata)))

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
