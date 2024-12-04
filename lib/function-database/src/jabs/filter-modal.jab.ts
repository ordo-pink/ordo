import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { ContextMenuItemType } from "@ordo-pink/core"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { DatabaseFilterModal } from "../components/database-filter-modal.component"
import { database_context } from "../database.context"
import { is_database_context_menu_payload } from "../database.constants"

export const show_filters_jab =
	(metadata: Ordo.Metadata.Instance): TMaokaJab =>
	({ use }) => {
		const commands = use(MaokaOrdo.Jabs.Commands.get)
		const ctx = use(MaokaOrdo.Context.consume)
		const { get_db_state, on_db_state_change } = use(database_context.consume)

		const add_filter_modal_cm_item = MaokaOrdo.Jabs.ContextMenu.add({
			command: "cmd.database.show_filter_modal",
			readable_name: "t.database.filter_modal.context_menu",
			should_show: is_database_context_menu_payload,
			payload_creator: () => ({ metadata, state: get_db_state() }),
			type: ContextMenuItemType.READ,
		})

		const add_filter_modal_cmd = MaokaOrdo.Jabs.Commands.add("cmd.database.show_filter_modal", () =>
			commands.emit("cmd.application.modal.show", {
				render: div =>
					Maoka.render_dom(
						div,
						MaokaOrdo.Components.WithCtx(ctx, () => DatabaseFilterModal(get_db_state(), on_db_state_change)),
					),
			}),
		)

		use(add_filter_modal_cm_item)
		use(add_filter_modal_cmd)
	}
