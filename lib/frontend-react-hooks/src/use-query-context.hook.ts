import { createContext, useContext } from "react"

import { type TMetadataQuery, type TUserQuery } from "@ordo-pink/data"
import { callOnce } from "@ordo-pink/tau"

const QueryContext = createContext<{ metadata_query: TMetadataQuery; user_query: TUserQuery }>(
	{} as any,
)

export const getQueryContextProvider = callOnce(() => QueryContext.Provider)

export const useQueryContext = () => {
	const context = useContext(QueryContext)

	return context
}
