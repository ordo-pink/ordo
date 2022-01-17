import {
	BrowserWindow,
	Clipboard,
	CrashReporter,
	GlobalShortcut,
	Menu,
	NativeImage,
	Notification,
	PowerMonitor,
	Screen,
	Session,
	ShareMenu,
	Shell,
	Tray,
} from "electron"
import { ActivityBarState } from "./containers/activity-bar/types"
import { CommanderState } from "./containers/commander/types"
import { PanelState } from "./containers/panel/types"
import { SidebarState } from "./containers/sidebar/types"
import { StatusBarState } from "./containers/status-bar/types"
import { SuggestionsState } from "./containers/suggestions/types"
import { WorkspaceState } from "./containers/workspace/types"

export type WindowState = {
	app: {
		window: BrowserWindow
		screen: Screen
		shell: Shell
		powerMonitor: PowerMonitor
		crashReporter: CrashReporter
		clipboard: Clipboard
		shortcuts: GlobalShortcut[]
		menu: Menu
		tray: Tray
		nativeImage: NativeImage
		notification: Notification
		session: Session
		shareMenu: ShareMenu
	}
	values: {
		activities: ActivityBarState
		commander: CommanderState
		panel: PanelState
		sidebar: SidebarState
		statusBar: StatusBarState
		suggestions: SuggestionsState
		workspace: WorkspaceState
	}
}
