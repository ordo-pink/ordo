import { ActivityBarEvent } from "./containers/activity-bar/types"
import { CommanderEvent } from "./containers/commander/types"
import { SidebarEvent } from "./containers/sidebar/types"
import { SuggestionsEvent } from "./containers/suggestions/types"
import { WorkspaceEvent } from "./containers/workspace/types"

export type OrdoEvents = ActivityBarEvent | CommanderEvent | SidebarEvent | SuggestionsEvent | WorkspaceEvent
