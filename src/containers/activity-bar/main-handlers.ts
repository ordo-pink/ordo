import { registerEventHandlers } from "../../common/register-ipc-main-handlers";

export default registerEventHandlers({
	"@activity-bar/show": ({ draft }) => void (draft.activities.show = true),
	"@activity-bar/hide": ({ draft }) => void (draft.activities.show = false),
	"@activity-bar/toggle": ({ state }) =>
		state.emit(state.get((s) => s.activities.show) ? "@activity-bar/hide" : "@activity-bar/show"),
	"@activity-bar/open-editor": ({ draft, state }) => {
		draft.activities.current = "Editor";
		draft.workspace.component = "Editor";
		draft.sidebar.component = "FileExplorer";

		state.emit("@sidebar/show");
	},
	"@activity-bar/open-graph": ({ draft, state }) => {
		draft.activities.current = "Graph";
		draft.workspace.component = "Graph";
		draft.sidebar.component = "";

		state.emit("@sidebar/hide");
	},
	"@activity-bar/open-find-in-files": ({ draft, state }) => {
		draft.activities.current = "Find in Files";
		draft.sidebar.component = "FileFinder";

		state.emit("@sidebar/show");
	},
	"@activity-bar/open-settings": ({ draft, state }) => {
		draft.activities.current = "Settings";
		draft.workspace.component = "Editor";
		draft.sidebar.component = "";

		state.emit("@sidebar/hide");
	},
});
