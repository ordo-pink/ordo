import { Command } from "../containers/commander/types"
import { OrdoEvent } from "../common/types"

export type APPLICATION_SCOPE = "application"

export type GetStateEvent = OrdoEvent<APPLICATION_SCOPE, "get-state">
export type OpenFolderEvent = OrdoEvent<APPLICATION_SCOPE, "open-folder">
export type CloseWindowEvent = OrdoEvent<APPLICATION_SCOPE, "close-window">
export type ToggleDevToolsEvent = OrdoEvent<APPLICATION_SCOPE, "toggle-dev-tools">
export type ReloadWindowEvent = OrdoEvent<APPLICATION_SCOPE, "reload-window">

export type ApplicationEvent =
	| GetStateEvent
	| OpenFolderEvent
	| CloseWindowEvent
	| ToggleDevToolsEvent
	| ReloadWindowEvent

export type ApplicationState = {
	commands: Command[]
	cwd: string
	showDevTools: boolean
}
