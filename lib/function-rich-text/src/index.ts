import * as Constants from "./rich-text.constants"
import * as Guards from "./rich-text.guards"
import * as Utils from "./rich-text.utils"
import { rich_text_editor$ as $ } from "./rich-text.state"
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
