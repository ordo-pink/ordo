import { registerEventHandlers } from "@core/register-ipc-main-handlers";
import { ActivityBarEvent } from "@containers/activity-bar/types";

export default registerEventHandlers<ActivityBarEvent>({
	"@activity-bar/show": ({ draft }) => void (draft.activities.show = true),
	"@activity-bar/hide": ({ draft }) => void (draft.activities.show = false),
	"@activity-bar/toggle": ({ transmission }) =>
		transmission.emit(transmission.get((s) => s.activities.show) ? "@activity-bar/hide" : "@activity-bar/show"),
	"@activity-bar/open-editor": ({ draft, transmission }) => {
		draft.activities.current = "Editor";
		draft.workspace.component = "Editor";
		draft.sidebar.component = "FileExplorer";

		transmission.emit("@sidebar/show");
	},
	"@activity-bar/open-graph": ({ draft, transmission }) => {
		draft.activities.current = "Graph";
		draft.workspace.component = "Graph";
		draft.sidebar.component = "";

		transmission.emit("@sidebar/hide");
	},
	"@activity-bar/open-find-in-files": ({ draft, transmission }) => {
		draft.activities.current = "Find in Files";
		draft.sidebar.component = "FileFinder";

		transmission.emit("@sidebar/show");
	},
	"@activity-bar/open-settings": ({ draft, transmission }) => {
		draft.activities.current = "Settings";
		draft.workspace.component = "Editor";
		draft.sidebar.component = "";

		transmission.emit("@sidebar/hide");
	},
});
