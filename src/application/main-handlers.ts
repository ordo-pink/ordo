import { original } from "immer"
import { registerIpcMainHandlers } from "../common/register-ipc-main-handlers"
import { ApplicationEvent } from "./types"

export default registerIpcMainHandlers<ApplicationEvent>({
	"@application/get-state": (state, _, context) => {
		context.window.webContents.send("apply-state-patches", original(state))
	},
	"@application/open-folder": (state, _, context) => {
		const filePaths = context.dialog.showOpenDialogSync(context.window, {
			properties: ["openDirectory", "createDirectory", "promptToCreate"],
		})

		if (!filePaths) {
			return
		}

		state.activities.current = "Graph"
		state.workspace.component = "Graph"
		state.commander.show = false
		state.sidebar.width = 0
		state.application.cwd = filePaths[0]
	},
})
