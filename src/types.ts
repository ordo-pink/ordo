import { ActivityBarEvent } from "./containers/activity-bar/types"
import { CommanderEvent } from "./containers/commander/types"
import { SidebarEvent } from "./containers/sidebar/types"
import { SuggestionsEvent } from "./containers/suggestions/types"

export type OrdoEvents = ActivityBarEvent | CommanderEvent | SidebarEvent | SuggestionsEvent
