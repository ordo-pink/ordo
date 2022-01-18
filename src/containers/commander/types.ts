import { SupportedIcon } from "../../icons/supported-icons"
import { OrdoEvent } from "../../common/types"

export type COMMANDER_SCOPE = "commander"

export type CommanderEvent =
	| OrdoEvent<COMMANDER_SCOPE, "get-state">
	| OrdoEvent<COMMANDER_SCOPE, "get-show">
	| OrdoEvent<COMMANDER_SCOPE, "get-hide">
	| OrdoEvent<COMMANDER_SCOPE, "get-toggle">
	| OrdoEvent<COMMANDER_SCOPE, "get-items", string | void>
	| OrdoEvent<COMMANDER_SCOPE, "run", string>

export type Command = {
	icon?: SupportedIcon
	name: string
	description: string
}

export type CommanderState = {
	show: boolean
	items: Command[]
}
