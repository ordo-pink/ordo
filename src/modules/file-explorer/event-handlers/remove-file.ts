import { OrdoEventHandler } from "@core/types";

export const handleRemoveFile: OrdoEventHandler<"@file-explorer/remove-file"> = async ({
	draft,
	payload,
	context,
	transmission,
}) => {
	const currentPath = transmission.select((state) => state.editor.currentTab);
	const tree = transmission.select((state) => state.fileExplorer.tree);
	const path = payload ? payload : currentPath;

	const isOpen = !payload || payload === currentPath;

	const response = context.dialog.showMessageBoxSync({
		type: "question",
		buttons: ["Yes", "No"],
		message: `Are you sure you want to remove "${path}"?`,
	});

	if (response === 0) {
		if (isOpen) {
			await transmission.emit("@editor/close-tab", path);
		}

		await context.trashItem(path);

		await transmission.emit("@file-explorer/list-folder", tree.path);
	}
};
