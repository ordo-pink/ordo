import * as Constants from "./rte.constants"
import * as Guards from "./rte.guards"
import * as Utils from "./rte.utils"
import { rich_text_editor$ as $ } from "./rte.state"
import { listen_for_selection_change_jab } from "./jabs/listen-for-selection-change.jab"

export const RTE = {
	$,
	Constants,
	Guards,
	Jabs: {
		listen_for_selection_change: listen_for_selection_change_jab,
	},
	Utils,
}
