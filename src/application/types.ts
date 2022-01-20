import { Command } from "../containers/commander/types"
import { OrdoEvent } from "../common/types"
import { Color } from "./appearance/colors/types"

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
	tree?: OrdoFolder
	showDevTools: boolean
}

export type OrdoEntity = OrdoFile | OrdoFolder

export type OrdoFile = {
	path: string
	readableName: string
	relativePath: string
	depth: number
	createdAt?: Date
	updatedAt?: Date
	accessedAt?: Date
	extension: string
	size: number
	type: "file"
	readableSize: string
}

export type OrdoFolder = {
	collapsed: boolean
	path: string
	readableName: string
	relativePath: string
	depth: number
	createdAt?: Date
	updatedAt?: Date
	accessedAt?: Date
	type: "folder"
	children: OrdoEntity[]
	color: keyof Color
}
