import { ipcMain } from "electron"
import { registerIpcMainHandlers } from "../../common/register-ipc-main-handlers"
import { CommanderEvent } from "./types"

export default registerIpcMainHandlers<CommanderEvent>({
	"@commander/get-items": (draft, filter) =>
		void (draft.commander.items = draft.application.commands.filter((command) => command.name.startsWith(filter || ""))),
	"@commander/show": (draft) => {
		draft.commander.show = true
		draft.application.commands.forEach((command) => draft.commander.items.push(command))
	},
	"@commander/hide": (draft) => {
		draft.commander.show = false
	},
	"@commander/toggle": (draft) => {
		if (draft.commander.show) {
			draft.commander.show = false
		} else {
			draft.commander.show = true
			ipcMain.emit("@commander/get-items")
		}
	},
})
