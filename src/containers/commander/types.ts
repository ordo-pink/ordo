import { SupportedIcon } from "../../icons/supported-icons"
import { OrdoEvent, OrdoEvents } from "../../common/types"

export type COMMANDER_SCOPE = "commander"

export type CommanderEvent =
	| OrdoEvent<COMMANDER_SCOPE, "toggle">
	| OrdoEvent<COMMANDER_SCOPE, "show">
	| OrdoEvent<COMMANDER_SCOPE, "hide">
	| OrdoEvent<COMMANDER_SCOPE, "get-items", string | void>
	| OrdoEvent<COMMANDER_SCOPE, "run", string>

export type Command<T extends OrdoEvents = OrdoEvents> = {
	icon?: SupportedIcon
	show?: boolean
	name: string
	description: string
	event: T
	shortcut?: string
}

export type CommanderState = {
	show: boolean
	items: Command[]
}
