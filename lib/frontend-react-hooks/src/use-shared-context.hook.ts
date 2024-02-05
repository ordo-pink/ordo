// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { type Context, useContext } from "react"

import { type PlainData } from "@ordo-pink/data"
import { callOnce } from "@ordo-pink/tau"

let SharedContext: Context<SharedContextValue>

export type SharedContextValue = {
	fid: symbol | null
	data: PlainData[] | null
	user: User.PublicUser | null
	route: Client.Router.Route | null
	workspaceSplitSize: [number, number]
}

export const __initUseSharedContext = callOnce((context: Context<SharedContextValue>): void => {
	SharedContext = context
})

export const useSharedContext = (): SharedContextValue => useContext(SharedContext)
