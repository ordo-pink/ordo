import { ipcMain } from "electron"
import { original } from "immer"
import { registerIpcMainHandlers } from "../common/register-ipc-main-handlers"
import { listFolder } from "./fs/list-folder"
import { ApplicationEvent } from "./types"

export default registerIpcMainHandlers<ApplicationEvent>({
	"@application/get-state": (state, _, context) => {
		context.window.webContents.send("set-state", original(state))
	},
	"@application/open-folder": async (state, _, context) => {
		const filePaths = context.dialog.showOpenDialogSync(context.window, {
			properties: ["openDirectory", "createDirectory", "promptToCreate"],
		})

		if (!filePaths) {
			return
		}

		state.application.cwd = filePaths[0]
		state.application.tree = await listFolder(state.application.cwd)

		ipcMain.emit("@activity-bar/open-editor")
	},
	"@application/close-window": (_, __, context) => {
		context.window.close()
	},
	"@application/toggle-dev-tools": (state, __, context) => {
		state.application.showDevTools = !state.application.showDevTools
		context.window.webContents.toggleDevTools()
	},
	"@application/reload-window": (state, __, context) => {
		context.window.webContents.reload()
	},
})
