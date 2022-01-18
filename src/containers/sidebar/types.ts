import { OrdoEvent } from "../../common/types"

export type SIDEBAR_SCOPE = "sidebar"

export type SidebarEvent =
	| OrdoEvent<SIDEBAR_SCOPE, "get-state">
	| OrdoEvent<SIDEBAR_SCOPE, "set-width", number>
	| OrdoEvent<SIDEBAR_SCOPE, "set-component", string>
	| OrdoEvent<SIDEBAR_SCOPE, "toggle">
	| OrdoEvent<SIDEBAR_SCOPE, "show">
	| OrdoEvent<SIDEBAR_SCOPE, "hide">

export type SidebarState = {
	show: boolean
	width: number
	component: string
}
