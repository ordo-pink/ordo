import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { TDatabaseState } from "./database.types"

export const database_context = MaokaJabs.create_context<{
	get_db_state: () => TDatabaseState
	on_db_state_change: (new_state: TDatabaseState) => void
}>()

export const create_database_context = (
	initial_state: TDatabaseState,
	on_state_change: (new_state: TDatabaseState) => void,
) => {
	let db_state = initial_state

	return {
		get_db_state: () => db_state,
		on_db_state_change: (new_state: Partial<TDatabaseState>) => {
			db_state = { ...db_state, ...new_state }

			on_state_change(db_state)
		},
	}
}
