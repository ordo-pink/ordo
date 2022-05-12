import { OrdoEventHandler } from "@core/types";
import { listFolder } from "@modules/file-explorer/api/list-folder";

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

		draft.fileExplorer.tree = await listFolder(tree.path);
	}
};
