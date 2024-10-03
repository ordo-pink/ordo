import { MaokaOrdo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { Metadata } from "@ordo-pink/core"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { TOption } from "@ordo-pink/option"
import { equals } from "ramda"

export const FileEditorWorkspace = (ctx: Ordo.CreateFunction.Params) => {
	return Maoka.create("div", ({ use, refresh }) => {
		use(ordo_context.provide(ctx))

		let route: Ordo.Router.Route | null = null
		const $ = use(MaokaOrdo.Hooks.current_route)
		const handle_current_route_change = (value: TOption<Ordo.Router.Route>) =>
			R.FromOption(value, () => null)
				.pipe(R.ops.chain(r => R.If(r.path !== route?.path, { T: () => r, F: () => r })))
				.pipe(R.ops.chain(r => R.If(!equals(r, route), { T: () => r, F: () => r })))
				.cata({
					Ok: async updated_route => {
						route = updated_route
						await refresh()
					},
					Err: async null_or_same_route => {
						// Skip since routes are equal
						if (null_or_same_route || !route) return

						route = null_or_same_route
						await refresh()
					},
				})

		use(MaokaOrdo.Hooks.subscription($, handle_current_route_change))
		const metadata_query = use(MaokaOrdo.Hooks.metadata_query)

		return () =>
			R.FromNullable(route)
				.pipe(R.ops.chain(MaokaOrdo.Ops.get_route_params))
				.pipe(R.ops.chain(({ fsid }) => R.FromNullable(fsid)))
				.pipe(R.ops.chain(check_is_fsid_valid))
				.pipe(R.ops.chain(metadata_query.get_by_fsid))
				.pipe(R.ops.chain(R.FromOption))
				.cata({
					Ok: metadata => [TitleSetter(metadata), RenderPicker(metadata)],
					Err: () => TitleSetter(null), // TODO No selected file component
				})
	})
}

// --- Internal ---

const RenderPicker = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use, refresh, element }) => {
		let file_associations: Ordo.FileAssociation.Instance[] = []

		const metadata_type = metadata.get_type()

		const $ = use(MaokaOrdo.Hooks.file_associations)
		const handle_update = (value: Ordo.FileAssociation.Instance[]) => {
			if (file_associations.length !== value.length) {
				file_associations = value
				void refresh()
			}
		}

		use(MaokaOrdo.Hooks.subscription($, handle_update))

		// TODO Unsupported file component
		// TODO Avoid glitches with double rendering
		return async () => {
			const file_association = file_associations.find(fa =>
				fa.types.some(t => t.name === metadata_type),
			)

			if (file_association && file_association.render) {
				await file_association.render({
					div: element as unknown as HTMLDivElement,
					metadata,
					content: null,
					is_editable: true,
					is_embedded: false,
					is_loading: false,
				})
			}
		}
	})

const TitleSetter = (metadata: Ordo.Metadata.Instance | null) =>
	Maoka.create("div", ({ use }) => {
		const metadata_query = use(MaokaOrdo.Hooks.metadata_query)
		const { emit } = use(MaokaOrdo.Hooks.commands)

		return () =>
			get_metadata_with_ancestors(metadata, metadata_query)
				.pipe(R.ops.map(({ metadata, ancestors }) => get_path(ancestors, metadata)))
				.cata({
					Ok: p => set_title(emit, p),
					Err: () => set_title(emit, "TODO: Empty Editor Title"),
				})
	})

const check_is_fsid_valid = (str: string) =>
	R.If(Metadata.Validations.is_fsid(str), { T: () => str as Ordo.Metadata.FSID })

const get_metadata_with_ancestors = (
	metadata: Ordo.Metadata.Instance | null,
	metadata_query: Ordo.Metadata.Query,
) =>
	R.FromNullable(metadata)
		.pipe(R.ops.chain(metadata => metadata_query.get_ancestors(metadata.get_fsid())))
		.pipe(R.ops.map(ancestors => ({ metadata: metadata!, ancestors })))

const set_title = (emit: Ordo.Command.Commands["emit"], title: string) =>
	emit("cmd.application.set_title", {
		status_bar_title: title,
		window_title: `${title} | File Editor`,
	})

// TODO: Move to metadata utils
const get_path = (ancestors: Ordo.Metadata.Instance[], metadata: Ordo.Metadata.Instance) =>
	Switch.OfTrue()
		.case(ancestors.length > 0, () =>
			ancestors
				.map(ancestor => ancestor.get_name())
				.join(" / ")
				.concat(" / ")
				.concat(metadata.get_name()),
		)
		.default(() => metadata.get_name())
