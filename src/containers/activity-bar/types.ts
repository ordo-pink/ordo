import { SupportedIcon } from "../../icons/supported-icons"
import { OrdoEvent } from "../../common/types"

export type ACTIVITY_BAR_SCOPE = "activity-bar"

export type ActivityBarEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "select", string>

export type ActivityBarState = {
	show: boolean
	topItems: ActivityBarItem[]
	bottomItems: ActivityBarItem[]
}

export type ActivityBarItem = {
	show: boolean
	name: string
	icon?: SupportedIcon
}
