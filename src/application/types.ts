import { Command } from "../containers/commander/types"
import { OrdoEvent } from "../common/types"

export type APPLICATION_SCOPE = "application"

export type GetStateEvent = OrdoEvent<APPLICATION_SCOPE, "get-state">
export type OpenFolderEvent = OrdoEvent<APPLICATION_SCOPE, "open-folder">

export type ApplicationEvent = GetStateEvent | OpenFolderEvent

export type ApplicationState = {
	commands: Command[]
	cwd: string
}
