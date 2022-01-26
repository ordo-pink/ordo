import { SupportedIcon } from "../../application/appearance/icons/supported-icons"
import { OrdoEvent } from "../../common/types"

export type ACTIVITY_BAR_SCOPE = "activity-bar"

export type ShowEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "show">
export type HideEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "hide">
export type ToggleEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "toggle">
export type OpenEditorEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-editor">
export type OpenGraphEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-graph">
export type OpenFindInFilesEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-find-in-files">
export type OpenSettingsEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-settings">

export type OpenActivityEvent = OpenEditorEvent & OpenGraphEvent & OpenFindInFilesEvent & OpenSettingsEvent

export type ActivityBarEvent = ShowEvent & HideEvent & ToggleEvent & OpenActivityEvent

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
	openEvent: keyof OpenActivityEvent
}
