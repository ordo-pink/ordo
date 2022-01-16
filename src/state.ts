import { ActivityBarState } from "./containers/activity-bar/types"
import { CommanderState } from "./containers/commander/types"
import { PanelState } from "./containers/panel/types"
import { SidebarState } from "./containers/sidebar/types"
import { StatusBarState } from "./containers/status-bar/types"
import { SuggestionsState } from "./containers/suggestions/types"
import { WorkspaceState } from "./containers/workspace/types"

export type WindowState = {
	app: {
		window: null
		settings: null
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
