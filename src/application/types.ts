import { Command } from "../containers/commander/types"
import { OrdoEvent } from "../common/types"

export type APPLICATION_SCOPE = "application"

export type GetStateEvent = OrdoEvent<APPLICATION_SCOPE, "get-state">

export type ApplicationEvent = GetStateEvent

export type ApplicationState = {
	commands: Command[]
}
