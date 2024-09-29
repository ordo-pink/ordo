import { type FSID, Metadata, type TMetadata, type TMetadataQuery } from "@ordo-pink/data"
import { Ordo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { type TCreateFunctionContext } from "@ordo-pink/core"

export const FileEditorWorkspace = (ctx: TCreateFunctionContext) => {
	return Maoka.create("div", ({ use }) => {
		use(ordo_context.provide(ctx))

		const route = use(Ordo.Hooks.current_route)
		const metadata_query = use(Ordo.Hooks.metadata_query)

		return () =>
			Result.FromNullable(route.value)
				.pipe(Result.ops.chain(Ordo.Ops.get_route_params))
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

const RenderPicker = (metadata: TMetadata) =>
	Maoka.create("div", ({ use, refresh, on_unmount, current_element }) => {
		let file_associations: Functions.FileAssociation[] = []
		const metadata_type = metadata.get_type()

		const file_associations$ = use(Ordo.Hooks.file_associations)

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
			file_association.render(current_element as unknown as HTMLDivElement, metadata)
			return
		}

		// TODO Unsupported file component
		return () => "WOOPS"
	})

const TitleSetter = (metadata: TMetadata | null) =>
	Maoka.create("div", ({ use }) => {
		const metadata_query = use(Ordo.Hooks.metadata_query)
		const { emit } = use(Ordo.Hooks.commands)

		return () =>
			get_metadata_with_ancestors(metadata, metadata_query)
				.pipe(Result.ops.map(({ metadata, ancestors }) => get_path(ancestors, metadata)))
				.cata({
					Ok: p => set_title(emit, p),
					Err: () => set_title(emit, "TODO: Empty Editor Title"),
				})
	})

const check_is_fsid_valid = (str: string) =>
	Result.If(Metadata.Validations.is_fsid(str), { T: () => str as FSID })

const get_metadata_with_ancestors = (metadata: TMetadata | null, metadata_query: TMetadataQuery) =>
	Result.FromNullable(metadata)
		.pipe(Result.ops.chain(metadata => metadata_query.get_ancestors(metadata.get_fsid())))
		.pipe(Result.ops.map(ancestors => ({ metadata: metadata!, ancestors })))

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
