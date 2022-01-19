import { SupportedIcon } from "../../icons/supported-icons"
import { OrdoEvent } from "../../common/types"

export type ACTIVITY_BAR_SCOPE = "activity-bar"

export type ShowActivityBarEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "show">
export type HideActivityBarEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "hide">
export type ToggleActivityBarEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "toggle">
export type SelectActivityBarEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "select", string>

export type ActivityBarEvent =
	| ShowActivityBarEvent
	| HideActivityBarEvent
	| ToggleActivityBarEvent
	| SelectActivityBarEvent

export type ActivityBarState = {
	show: boolean
	current?: string
	topItems: ActivityBarItem[]
	bottomItems: ActivityBarItem[]
}

export type ActivityBarItem = {
	show: boolean
	name: string
	icon?: SupportedIcon
}
