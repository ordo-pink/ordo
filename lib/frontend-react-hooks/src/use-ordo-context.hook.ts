import { createContext, useContext } from "react"

import { TOrdoContext } from "@ordo-pink/core"

export const create_ordo_context = () => OrdoContext.Provider

export const useOrdoContext = () => {
	const context = useContext(OrdoContext)

	return context
}

const OrdoContext = createContext<TOrdoContext>({} as any)
