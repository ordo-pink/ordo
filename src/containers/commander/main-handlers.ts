import { registerIpcMainHandlers } from "../../common/register-ipc-main-handlers"
import { CommanderEvent } from "./types"

export default registerIpcMainHandlers<CommanderEvent>({
	"@commander/get-items": (draft, filter) =>
		void (draft.commander.items = draft.application.commands.filter((command) => command.name.startsWith(filter || ""))),
	"@commander/show": (draft) => void (draft.commander.show = true),
	"@commander/hide": (draft) => void (draft.activities.show = false),
	"@commander/toggle": (draft) => void (draft.commander.show = !draft.commander.show),
})
