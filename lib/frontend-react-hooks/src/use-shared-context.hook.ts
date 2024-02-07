// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { type Context, useContext } from "react"

import { type PlainData } from "@ordo-pink/data"
import { callOnce } from "@ordo-pink/tau"

let SharedContext: Context<SharedContextValue>

// TODO: Move data to useData
// TODO: Move fid to useFID
// TODO: Move route to useRoute
// TODO: Move workspaceSplitSize to useWorkspaceSize and useSidebarSize
// TODO: Move persistedState to usePersistedState
export type SharedContextValue = {
	fid: symbol | null
	data: PlainData[] | null
	route: Client.Router.Route | null
	workspaceSplitSize: [number, number]
}

export const __initUseSharedContext = callOnce((context: Context<SharedContextValue>): void => {
	SharedContext = context
})

export const useSharedContext = (): SharedContextValue => useContext(SharedContext)
