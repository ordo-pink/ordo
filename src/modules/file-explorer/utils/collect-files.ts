import { OrdoFile, OrdoFolder } from "../types";
import { isFolder } from "./is-folder";

export const collectFiles = (
	tree: OrdoFolder,
	files: Pick<OrdoFile, "path" | "relativePath" | "type" | "readableName" | "size">[] = [],
) => {
	tree.children.forEach((child) => {
		if (isFolder(child)) {
			collectFiles(child, files);
		} else {
			files.push({
				path: child.path,
				readableName: child.readableName,
				relativePath: child.relativePath,
				type: child.type,
				size: child.size,
			});
		}
	});

	return files;
};
