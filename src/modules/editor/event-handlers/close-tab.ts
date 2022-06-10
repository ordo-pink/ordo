import { OrdoEventHandler } from "@core/types";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

export const handleCloseTab: OrdoEventHandler<"@editor/close-tab"> = ({ draft, payload, transmission, context }) => {
	const currentTab = transmission.select((state) => state.editor.currentTab);
	const tabIndex = transmission.select((state) => state.editor.tabs.findIndex((tab) => tab.path === payload));
	const currentTabIndex = transmission.select((state) => state.editor.tabs.findIndex((tab) => tab.path === currentTab));
	const tree = transmission.select((state) => state.fileExplorer.tree);
	const tab = draft.editor.tabs.find((t) => t.path === currentTab);
	const file = findOrdoFile(tree, "path", currentTab);
	const index = tabIndex !== -1 ? tabIndex : currentTabIndex;

	if (!file || !tab || index === -1) {
		return;
	}

	draft.editor.tabs.splice(index, 1);
	const nextFilePath = draft.editor.tabs[index === 0 ? draft.editor.tabs.length - 1 : 0]?.path || "";

	if (draft.editor.tabs.length) {
		draft.editor.currentTab = nextFilePath;
	}

	const nextFile = findOrdoFile(tree, "path", nextFilePath);

	if (!nextFile) {
		context.window.setRepresentedFilename("");
		context.window.setTitle("Ordo");
		draft.editor.focused = false;
		return;
	}

	context.window.setRepresentedFilename(nextFile.path);
	context.window.setTitle(`${nextFile.relativePath} — ${tree.readableName}`);
	draft.editor.focused = true;
};
