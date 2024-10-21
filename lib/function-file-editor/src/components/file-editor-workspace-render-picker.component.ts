import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { invokers0 } from "@ordo-pink/oath"

export const RenderPicker = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", async ({ use, refresh, element, on_unmount }) => {
		let file_associations: Ordo.FileAssociation.Instance[] = []

		const metadata_fsid = metadata.get_fsid()
		const metadata_type = metadata.get_type()

		const content_query = use(MaokaOrdo.Jabs.ContentQuery)

		const content0 = content_query.get(metadata_fsid)
		const content = await content0.invoke(invokers0.or_else(() => null))

		const $ = use(MaokaOrdo.Jabs.FileAssociations$)
		const handle_update = (value: Ordo.FileAssociation.Instance[]) => {
			if (file_associations.length !== value.length) {
				file_associations = value
				void refresh()
			}
		}

		on_unmount(() => content0.cancel())

		use(MaokaOrdo.Jabs.subscribe($, handle_update))

		// TODO Unsupported file component
		return async () => {
			element.innerHTML = ""

			const fa = file_associations.find(fa => fa.types.some(t => t.name === metadata_type))

			if (!fa || !fa.render) return

			const div = element as unknown as HTMLDivElement
			const is_editable = true // TODO Check if user has edit rights
			const is_embedded = false

			await fa.render({ div, metadata, content, is_editable, is_embedded })
		}
	})
