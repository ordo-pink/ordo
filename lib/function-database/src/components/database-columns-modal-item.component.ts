import { Checkbox } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { type TColumnName } from "../database.types"
import { database$ } from "../database.state"

export const DatabaseColumnModalItem = (column: TColumnName) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("database_modal_columns_item"))

		const { t } = use(MaokaOrdo.Jabs.get_translations$)
		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_db_state = use(MaokaOrdo.Jabs.happy_marriage$(database$))

		return () => {
			const db_state = get_db_state()
			const active_columns = db_state.visible_columns ?? ["t.database.column_names.name", "t.database.column_names.labels"]
			const is_checkbox_checked = active_columns.includes(column)
			const handle_checkbox_change = () => commands.emit("cmd.database.toggle_column", column)

			const t_column_name = t(column as Ordo.I18N.TranslationKey)

			return [
				DatabaseColumnsModalSubtitle(() => t_column_name),
				Checkbox({ checked: is_checkbox_checked, on_change: handle_checkbox_change }),
			]
		}
	})

const DatabaseColumnsModalSubtitle = Maoka.styled("div")
