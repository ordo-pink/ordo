import { SupportedIcon } from "../../application/appearance/icons/supported-icons"
import { OrdoEvent, OrdoEvents } from "../../common/types"

export type COMMANDER_SCOPE = "commander"

export type ShowEvent = OrdoEvent<COMMANDER_SCOPE, "show">
export type HideEvent = OrdoEvent<COMMANDER_SCOPE, "hide">
export type ToggleEvent = OrdoEvent<COMMANDER_SCOPE, "toggle">
export type SelectEvent = OrdoEvent<COMMANDER_SCOPE, "get-items", string>
export type RunEvent = OrdoEvent<COMMANDER_SCOPE, "run", string>

export type CommanderEvent = ShowEvent | HideEvent | ToggleEvent | SelectEvent | RunEvent

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
