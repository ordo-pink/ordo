// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Context, useContext as UseContext } from "react"
import type { PlainData } from "@ordo-pink/data"
import type { Nullable } from "@ordo-pink/tau"
import { Commands, Router } from "../types"

let SharedContext: Context<SharedContextValue>
let useContextHook: typeof UseContext

export type SharedContextValue = {
	data: Nullable<PlainData[]>
	route: Nullable<Router.Route>
	commands: Commands.Commands
}

export const __useSharedContextInit = (
	context: typeof SharedContext,
	useContext: typeof UseContext,
) => {
	SharedContext = context
	useContextHook = useContext
}

export const useSharedContext = () => {
	return useContextHook(SharedContext)
}
