import { BrowserWindow } from "electron"
import { ApplicationEvent, ApplicationState } from "../application/types"
import { ActivityBarEvent, ActivityBarState } from "../containers/activity-bar/types"
import { CommanderEvent, CommanderState } from "../containers/commander/types"
import { SidebarEvent, SidebarState } from "../containers/sidebar/types"
import { WorkspaceEvent, WorkspaceState } from "../containers/workspace/types"

export type OrdoEvents = ApplicationEvent | ActivityBarEvent | CommanderEvent | SidebarEvent | WorkspaceEvent

export type Optional<T> = T | undefined

export type UnaryFn<T, R> = (x: T) => R

export type OrdoEvent<T extends string, K extends string, Args = void> = Args extends void
	? [`@${T}/${K}`]
	: [`@${T}/${K}`, Args]

export type WindowContext = {
	window: BrowserWindow
}

export type WindowState<T extends Record<string, unknown> = Record<string, unknown>> = {
	application: ApplicationState
	activities: ActivityBarState
	commander: CommanderState
	sidebar: SidebarState
	workspace: WorkspaceState
	components: T
}
