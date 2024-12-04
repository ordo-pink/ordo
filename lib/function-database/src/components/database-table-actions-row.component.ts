import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { BsPlus } from "@ordo-pink/frontend-icons"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const DatabaseTableActionsRow = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("tr", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.Commands.get)
		use(MaokaJabs.set_class("border-y database_border-color"))

		return () =>
			Maoka.create("td", ({ use }) => {
				use(MaokaJabs.set_class("px-2 py-1 text-neutral-500 text-sm flex gap-x-1 cursor-pointer"))
				use(MaokaJabs.listen("onclick", () => handle_column_title_click()))

				const handle_column_title_click = () => emit("cmd.metadata.show_create_modal", metadata.get_fsid())

				return () => [
					BsPlus() as TMaokaElement,
					Maoka.create("div", () => () => "New"), // TODO: i18n
				]
			})
	})
