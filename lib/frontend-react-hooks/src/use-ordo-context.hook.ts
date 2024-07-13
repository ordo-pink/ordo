import { createContext, useContext } from "react"

import { TOrdoContext } from "@ordo-pink/core"
import { call_once } from "@ordo-pink/tau"

export const __init_ordo_context = call_once(() => OrdoContext.Provider)

export const useOrdoContext = () => {
	const context = useContext(OrdoContext)

	return context
}

const OrdoContext = createContext<TOrdoContext>({} as any)
