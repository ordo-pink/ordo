// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { type Context, useContext } from "react"
import type { PlainData } from "@ordo-pink/data"

let SharedContext: Context<SharedContextValue>

export type SharedContextValue = {
	data: PlainData[] | null
	route: Client.Router.Route | null
	user: User.User | null
	commands: Client.Commands.Commands
	fileAssociations: Extensions.FileAssociation[]
	workspaceSplitSize: [number, number]
}

export const __initUseSharedContext = (context: typeof SharedContext) => {
	SharedContext = context
}

export const useSharedContext = (): SharedContextValue => {
	return useContext(SharedContext)
}
