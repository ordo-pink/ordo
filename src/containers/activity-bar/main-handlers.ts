import { ipcMain } from "electron"
import { Draft } from "immer"
import { WindowState } from "../../common/types"
import { registerIpcMainHandlers } from "../../common/register-ipc-main-handlers"
import { ActivityBarEvent } from "./types"

const openActivity =
	(options: {
		activityName: string
		workspaceComponent?: string
		sidebarComponent?: string
		sidebar?: "show" | "hide"
	}) =>
	(draft: Draft<WindowState>) => {
		draft.activities.current = options.activityName

		if (options.workspaceComponent) {
			draft.workspace.component = options.workspaceComponent
		}

		if (options.sidebarComponent) {
			draft.sidebar.component = options.sidebarComponent
		}

		ipcMain.emit(options.sidebar === "show" ? "@sidebar/show" : "@sidebar/hide")
		ipcMain.emit("@commander/hide")
	}

export default registerIpcMainHandlers<ActivityBarEvent>({
	"@activity-bar/show": (draft) => void (draft.activities.show = true),
	"@activity-bar/hide": (draft) => void (draft.activities.show = false),
	"@activity-bar/toggle": (draft) => void (draft.activities.show = !draft.activities.show),
	"@activity-bar/open-editor": openActivity({
		activityName: "Editor",
		workspaceComponent: "Editor",
		sidebarComponent: "FileExplorer",
		sidebar: "show",
	}),
	"@activity-bar/open-graph": openActivity({
		activityName: "Graph",
		workspaceComponent: "Graph",
		sidebar: "hide",
	}),
	"@activity-bar/open-find-in-files": openActivity({
		activityName: "Find in Files",
		sidebarComponent: "FileFinder",
		sidebar: "show",
	}),
	"@activity-bar/open-settings": openActivity({
		activityName: "Settings",
		workspaceComponent: "Editor",
		sidebar: "hide",
	}),
})
