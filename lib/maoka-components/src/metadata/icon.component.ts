import { BsFileEarmark, BsFileEarmarkBinary, BsFolderOpen } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { Switch } from "@ordo-pink/switch"
import { type TMetadata } from "@ordo-pink/data"

// TODO: Move to common components
type P = { metadata: TMetadata; custom_class?: string }
export const MetadataIcon = ({ metadata, custom_class = "" }: P) =>
	Maoka.create("div", ({ use }) => {
		const emoji_icon = metadata.get_property("emoji_icon")

		if (emoji_icon.is_some)
			return Maoka.create("div", ({ use }) => {
				use(Maoka.hooks.set_class(custom_class))
				return emoji_icon.unwrap()
			})

		const metadata_query = use(OrdoHooks.metadata_query)

		const has_children_result = metadata_query.has_children(metadata.get_fsid())

		return has_children_result.cata({
			Err: () => Icon({ metadata, custom_class, has_children: false }),
			Ok: has_children => Icon({ metadata, custom_class, has_children }),
		})
	})

type P2 = P & { has_children: boolean }
const Icon = ({ metadata, custom_class, has_children }: P2) =>
	Maoka.create("div", () => {
		// const file_associations = use(OrdoHooks.file_associations)
		// const metadata_file_association = file_associations.find(association =>
		// 	association.content_type.includes(metadata.get_type()),
		// )

		return (
			Switch.OfTrue()
				.case(has_children, () => BsFolderOpen(custom_class))
				.case(metadata.get_size() === 0, () => BsFileEarmark(custom_class))
				// TODO:  Render FileAssociation icon :: .case(!!metadata_file_association, () => )
				.default(() => BsFileEarmarkBinary(custom_class))
		)
	})
