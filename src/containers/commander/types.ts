import { SupportedIcon } from "../../appearance/icons/supported-icons"
import { OrdoEvent, OrdoEvents } from "../../common/types"

export type COMMANDER_SCOPE = "commander"

export type ShowCommanderEvent = OrdoEvent<COMMANDER_SCOPE, "show">
export type HideCommanderEvent = OrdoEvent<COMMANDER_SCOPE, "hide">
export type ToggleCommanderEvent = OrdoEvent<COMMANDER_SCOPE, "toggle">
export type SelectCommanderEvent = OrdoEvent<COMMANDER_SCOPE, "get-items", string>

export type CommanderEvent = ShowCommanderEvent | HideCommanderEvent | ToggleCommanderEvent | SelectCommanderEvent

export type Command<T extends OrdoEvents = OrdoEvents> = {
	icon?: SupportedIcon
	name: string
	description: string
	event: T
	shortcut?: string
}

export type CommanderState = {
	show: boolean
	items: Command[]
}
