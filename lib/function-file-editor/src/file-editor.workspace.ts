import { MaokaOrdo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { Metadata } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

export const FileEditorWorkspace = (ctx: Ordo.CreateFunction.Params) => {
	return Maoka.create("div", ({ use }) => {
		use(ordo_context.provide(ctx))

		const route = use(MaokaOrdo.Hooks.current_route)
		const metadata_query = use(MaokaOrdo.Hooks.metadata_query)

		return () =>
			Result.FromNullable(route.value)
				.pipe(Result.ops.chain(MaokaOrdo.Ops.get_route_params))
				.pipe(Result.ops.chain(({ fsid }) => Result.FromNullable(fsid)))
				.pipe(Result.ops.chain(check_is_fsid_valid))
				.pipe(Result.ops.chain(metadata_query.get_by_fsid))
				.pipe(Result.ops.chain(Result.FromOption))
				.cata({
					Ok: metadata => [TitleSetter(metadata), RenderPicker(metadata)],
					Err: () => TitleSetter(null), // TODO No selected file component
				})
	})
}

// --- Internal ---

const RenderPicker = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use, refresh, on_unmount, current_element }) => {
		let file_associations: Ordo.FileAssociation.Instance[] = []
		const metadata_type = metadata.get_type()

		const file_associations$ = use(MaokaOrdo.Hooks.file_associations)

		const subscription = file_associations$.subscribe(value => {
			if (file_associations.length !== value.length) {
				file_associations = value
				refresh()
			}
		})

		on_unmount(() => subscription.unsubscribe())

		const file_association = file_associations.find(fa =>
			fa.types.some(t => t.name === metadata_type),
		)

		if (file_association && file_association.render) {
			file_association.render({
				div: current_element as unknown as HTMLDivElement,
				metadata,
				content: null,
				is_editable: true,
				is_embedded: false,
				is_loading: false,
			})
			return
		}

		// TODO Unsupported file component
		return () => "WOOPS"
	})

const TitleSetter = (metadata: Ordo.Metadata.Instance | null) =>
	Maoka.create("div", ({ use }) => {
		const metadata_query = use(MaokaOrdo.Hooks.metadata_query)
		const { emit } = use(MaokaOrdo.Hooks.commands)

		return () =>
			get_metadata_with_ancestors(metadata, metadata_query)
				.pipe(Result.ops.map(({ metadata, ancestors }) => get_path(ancestors, metadata)))
				.cata({
					Ok: p => set_title(emit, p),
					Err: () => set_title(emit, "TODO: Empty Editor Title"),
				})
	})

const check_is_fsid_valid = (str: string) =>
	Result.If(Metadata.Validations.is_fsid(str), { T: () => str as Ordo.Metadata.FSID })

const get_metadata_with_ancestors = (
	metadata: Ordo.Metadata.Instance | null,
	metadata_query: Ordo.Metadata.Query,
) =>
	Result.FromNullable(metadata)
		.pipe(Result.ops.chain(metadata => metadata_query.get_ancestors(metadata.get_fsid())))
		.pipe(Result.ops.map(ancestors => ({ metadata: metadata!, ancestors })))

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
