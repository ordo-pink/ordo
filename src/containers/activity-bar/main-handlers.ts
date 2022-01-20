import { ipcMain } from "electron"
import { registerIpcMainHandlers } from "../../common/register-ipc-main-handlers"
import { ActivityBarEvent } from "./types"

export default registerIpcMainHandlers<ActivityBarEvent>({
	"@activity-bar/show": (draft) => void (draft.activities.show = true),
	"@activity-bar/hide": (draft) => void (draft.activities.show = false),
	"@activity-bar/toggle": (draft) => void (draft.activities.show = !draft.activities.show),
	"@activity-bar/open-editor": (draft) => {
		draft.activities.current = "Editor"
		draft.workspace.component = "WelcomePage"
		draft.commander.show = false
		draft.sidebar.width = 25

		ipcMain.emit("@commander/hide")
	},
	"@activity-bar/open-graph": (draft) => {
		draft.activities.current = "Graph"
		draft.workspace.component = "Graph"
		draft.sidebar.width = 0

		ipcMain.emit("@commander/hide")
	},
	"@activity-bar/open-find-in-files": (draft) => {
		draft.activities.current = "Find in Files"
		draft.workspace.component = "WelcomePage"
		draft.commander.show = false
		draft.sidebar.width = 0

		ipcMain.emit("@commander/hide")
	},
	"@activity-bar/open-settings": (draft) => {
		draft.activities.current = "Settings"
		draft.workspace.component = "WelcompePage"
		draft.commander.show = false
		draft.sidebar.width = 0

		ipcMain.emit("@commander/hide")
	},
})
