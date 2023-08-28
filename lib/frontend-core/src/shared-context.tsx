// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Context, useContext as UseContext } from "react"
import type { FSEntity } from "@ordo-pink/datautil"
import type { Nullable } from "@ordo-pink/tau"

let SharedContext: Context<{ metadata: Nullable<FSEntity[]> }>
let useContextHook: typeof UseContext

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
