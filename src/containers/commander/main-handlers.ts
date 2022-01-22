import { ipcMain } from "electron"
import { registerIpcMainHandlers } from "../../common/register-ipc-main-handlers"
import { CommanderEvent } from "./types"

export default registerIpcMainHandlers<CommanderEvent>({
	"@commander/get-items": (draft, filter) =>
		void (draft.commander.items = draft.application.commands.filter((command) => command.name.startsWith(filter || ""))),
	"@commander/show": (draft) => {
		draft.commander.show = true
		ipcMain.emit("@commander/get-items", "")
	},
	"@commander/hide": (draft) => {
		draft.commander.show = false
	},
	"@commander/run": (draft, command) => {
		draft.commander.show = false
		ipcMain.emit(command as string)
	},
	"@commander/toggle": (draft) => {
		draft.commander.show = !draft.commander.show

		if (draft.commander.show) {
			ipcMain.emit("@commander/get-items", "")
		}
	},
})
