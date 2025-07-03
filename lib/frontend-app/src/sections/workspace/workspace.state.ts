import { CLIENT } from "@ordo-pink/sdk-client"
import { create_zags } from "@ordo-pink/zags"

import type { Sidebar } from "./workspace.types"

export const sidebar$ = create_zags<Sidebar.State>({
	enabled: false,
	visible: window.innerWidth >= CLIENT.SM_SCREEN_BREAKPOINT,
})
