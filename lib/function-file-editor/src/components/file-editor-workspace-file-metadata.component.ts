import { CurrentUserReference, MetadataIcon } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

export const FileMetadata = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use }) => {
		const metadata_name = metadata.get_name()
		const metadata_last_update = metadata.get_updated_at()

		use(MaokaJabs.add_class("p-2"))

		return () => [
			TitleSection(() => [MetadataIcon({ metadata }), Title(() => metadata_name)]),
			AuthorSection(() => [
				CurrentUserReference,
				Timestamp(() => metadata_last_update.toLocaleString()),
			]),
		]
	})

// TODO time?
const Timestamp = Maoka.styled("time")

const TitleSection = Maoka.styled("div", { class: "flex space-x-2 items-center text-2xl" })

// TODO Editable title (take from `function-database`)
const Title = Maoka.styled("h1", { class: "font-extrabold cursor-text w-full" })

const AuthorSection = Maoka.styled("div", { class: "p-1 flex space-x-2 items-center text-sm" })
