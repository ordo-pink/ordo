import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

export const TitleSetter = (metadata: Ordo.Metadata.Instance | null) =>
	Maoka.create("div", ({ use }) => {
		const metadata_query = use(MaokaOrdo.Jabs.MetadataQuery)
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		return () =>
			get_metadata_with_ancestors(metadata, metadata_query)
				.pipe(R.ops.map(({ metadata, ancestors }) => get_path(ancestors, metadata)))
				.cata({
					Ok: p => set_title(emit, p),
					Err: () => set_title(emit, "TODO: Empty Editor Title"),
				})
	})

const get_metadata_with_ancestors = (
	metadata: Ordo.Metadata.Instance | null,
	metadata_query: Ordo.Metadata.Query,
) =>
	R.FromNullable(metadata)
		.pipe(R.ops.chain(metadata => metadata_query.get_ancestors(metadata.get_fsid())))
		.pipe(R.ops.map(ancestors => ({ metadata: metadata!, ancestors })))

const set_title = (emit: Ordo.Command.Commands["emit"], title: string) =>
	emit("cmd.application.set_title", `${title} | File Editor` as any)

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
