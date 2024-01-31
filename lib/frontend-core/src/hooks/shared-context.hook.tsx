// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Context, useContext as UseContext } from "react"
import type { PlainData } from "@ordo-pink/data"
import { Commands, Extensions, Router, User } from "../types"

let SharedContext: Context<SharedContextValue>
let useContextHook: typeof UseContext

export type SharedContextValue = {
	data: PlainData[] | null
	route: Router.Route | null
	user: User.User | null
	commands: Commands.Commands
	fileAssociations: Extensions.FileAssociation[]
	workspaceSplitSize: [number, number]
}

export const __useSharedContextInit = (
	context: typeof SharedContext,
	useContext: typeof UseContext,
) => {
	SharedContext = context
	useContextHook = useContext
}

export const useSharedContext = (): SharedContextValue => {
	return useContextHook(SharedContext)
}
