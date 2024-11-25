import { SortingDirection } from "./database.constants"

export type TDatabaseState = Partial<{
	sorting: Partial<Record<string, SortingDirection>>
}>
