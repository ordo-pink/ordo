import { OrdoFolder } from "@modules/file-explorer/types";
import { useIcon } from "@core/hooks/use-icon";
import { SupportedIcon } from "@core/types";

export const useFolderIcons = (folder: OrdoFolder) => {
	const collapseIcon: SupportedIcon = folder.collapsed ? "HiOutlineChevronRight" : "HiOutlineChevronDown";

	let folderIcon: SupportedIcon;

	if (folder.collapsed) {
		folderIcon = folder.children.length > 0 ? "HiFolder" : "HiOutlineFolder";
	} else {
		folderIcon = folder.children.length > 0 ? "HiFolderOpen" : "HiOutlineFolderOpen";
	}

	const CollapseIcon = useIcon(collapseIcon);
	const FolderIcon = useIcon(folderIcon);

	return { FolderIcon, CollapseIcon };
};
