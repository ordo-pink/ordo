import { registerEvents } from "@core/transmission/register-ordo-events";
import { EditorEvents } from "@modules/editor/types";
import { handleToggleToDo } from "@modules/editor/event-handlers/toggle-todo";
import { handleOpenExternalLink } from "@modules/editor/event-handlers/open-external-link";
import { handleOpenTab } from "@modules/editor/event-handlers/open-tab";
import { handleCloseTab } from "@modules/editor/event-handlers/close-tab";
import { handleUpdateCaretPositions } from "@modules/editor/event-handlers/update-caret-positions";
import { handleFocus } from "@modules/editor/event-handlers/focus";
import { handleUnfocus } from "@modules/editor/event-handlers/unfocus";
import { handleTyping } from "@modules/editor/event-handlers/handle-typing";
import { handleSelectAll } from "@modules/editor/event-handlers/select-all";

export default registerEvents<EditorEvents>({
	"@editor/toggle-todo": handleToggleToDo,
	"@editor/open-tab": handleOpenTab,
	"@editor/open-external-link": handleOpenExternalLink,
	"@editor/close-tab": handleCloseTab,
	"@editor/update-caret-positions": handleUpdateCaretPositions,
	"@editor/focus": handleFocus,
	"@editor/unfocus": handleUnfocus,
	"@editor/handle-typing": handleTyping,
	"@editor/select-all": handleSelectAll,
});
