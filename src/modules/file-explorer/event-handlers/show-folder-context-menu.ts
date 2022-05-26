import { Menu, MenuItem } from "electron";
import { is } from "electron-util";

import { Colors } from "@core/appearance/colors";
import { OrdoEventHandler } from "@core/types";
import { findOrdoFolderByPath } from "@modules/file-explorer/utils/find-ordo-folder";

/**
 * Shows folder context menu.
 */
export const handleShowFolderContextMenu: OrdoEventHandler<"@file-explorer/show-folder-context-menu"> = ({
	payload: { x, y, path },
	transmission,
	context,
}) => {
	const tree = transmission.select((state) => state.fileExplorer.tree);
	const folder = findOrdoFolderByPath(tree, path);

	if (!folder) {
		return;
	}

	const menu = new Menu();

	menu.append(
		new MenuItem({
			label: "New File",
			accelerator: "CommandOrControl+N",
			click: () => transmission.emit("@file-explorer/show-file-creation", path),
		}),
	);

	menu.append(
		new MenuItem({
			label: "New Folder",
			accelerator: "CommandOrControl+Alt+N",
			click: () => transmission.emit("@file-explorer/show-folder-creation", path),
		}),
	);

	menu.append(new MenuItem({ type: "separator" }));

	menu.append(
		new MenuItem({
			label: "Reveal in Finder",
			accelerator: "CommandOrControl+Alt+R",
			click: () => transmission.emit("@file-explorer/reveal-in-finder", path),
		}),
	);

	if (!is.windows) {
		menu.append(new MenuItem({ type: "separator" }));
	}

	const colorOptions = Colors.map(
		(color) =>
			new MenuItem({
				label: color[0].toUpperCase() + color.slice(1),
				type: "radio",
				checked: folder.color === color,
				click: () => transmission.emit("@file-explorer/set-folder-color", { path, color }),
			}),
	);

	menu.append(new MenuItem({ type: "separator" }));

	menu.append(
		new MenuItem({
			label: "Color",
			submenu: colorOptions as unknown as Menu,
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
			label: "Remove Folder",
			click: () => transmission.emit("@file-explorer/remove-folder", path),
		}),
	);

	menu.popup({
		window: context.window,
		x,
		y,
	});
};
