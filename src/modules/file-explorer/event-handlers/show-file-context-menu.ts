import { Menu, MenuItem } from "electron";

import { OrdoEventHandler } from "@core/types";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

export const handleShowFileContextMenu: OrdoEventHandler<"@file-explorer/show-file-context-menu"> = ({
	payload: { x, y, path },
	transmission,
	context,
}) => {
	const tree = transmission.select((state) => state.fileExplorer.tree);
	const file = findOrdoFile(tree, "path", path);

	if (!file) {
		return;
	}

	const menu = new Menu();

	menu.append(
		new MenuItem({
			label: "Reveal in Finder",
			accelerator: "CommandOrControl+Alt+R",
			click: () => transmission.emit("@file-explorer/reveal-in-finder", path),
		}),
	);

	menu.append(new MenuItem({ type: "separator" }));

	menu.append(
		new MenuItem({
			label: "Copy Path",
			accelerator: "CommandOrControl+Option+C",
			click: () => transmission.emit("@file-explorer/copy-path", path),
		}),
	);

	menu.append(
		new MenuItem({
			label: "Remove File",
			click: () => transmission.emit("@file-explorer/remove-file", path),
		}),
	);

	menu.popup({
		window: context.window,
		x,
		y,
	});
};
