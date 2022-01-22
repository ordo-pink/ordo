import { ipcMain } from "electron"
import { registerIpcMainHandlers } from "../common/register-ipc-main-handlers"
import { listFolder } from "./fs/list-folder"
import { readFile } from "./fs/read-file"
import { ApplicationEvent, OpenOrdoFile } from "./types"
import { getFile } from "./utils/get-file"

export default registerIpcMainHandlers<ApplicationEvent>({
	"@application/get-state": () => {
		ipcMain.emit("send-state")
	},
	"@application/close-window": (_, __, context) => {
		context.window.close()
	},
	"@application/toggle-dev-tools": (state, __, context) => {
		state.application.showDevTools = !state.application.showDevTools
		context.window.webContents.toggleDevTools()
	},
	"@application/reload-window": (_, __, context) => {
		context.window.webContents.reload()
	},

	"@application/open-folder": async (state, _, context) => {
		const filePaths = context.dialog.showOpenDialogSync(context.window, {
			properties: ["openDirectory", "createDirectory", "promptToCreate"],
		})

		if (!filePaths) {
			return
		}

		ipcMain.emit("@activity-bar/open-editor")

		state.application.cwd = filePaths[0]
		state.application.tree = await listFolder(state.application.cwd)
	},
	"@application/open-file": async (state, path) => {
		if (!path || !state.application.tree) {
			return
		}

		const alreadyOpen = state.application.openFiles.findIndex((file) => file.path === path)

		if (~alreadyOpen) {
			ipcMain.emit("@application/set-current-file", alreadyOpen)

			return
		}

		const file = getFile(state.application.tree, path as string) as OpenOrdoFile

		if (!file) {
			return
		}

		file.body = await readFile(file)
		file.selection = {
			start: { line: 0, index: 0 },
			end: { line: 0, index: 0 },
			direction: "ltr",
		}

		state.application.openFiles.push(file)
		state.application.currentFile = state.application.openFiles.length - 1
	},
	"@application/set-current-file": (state, index) => {
		state.application.currentFile = index as number
	},
	"@application/close-file": (state, index) => {
		if (index == null) {
			index = state.application.currentFile
		}

		state.application.openFiles.splice(index as number, 1)

		if (state.application.currentFile === index) {
			if (state.application.currentFile > 0) {
				state.application.currentFile--
			} else {
				state.application.currentFile = 0
			}
		} else if (state.application.currentFile > index) {
			state.application.currentFile--
		}
	},
})
