import { promises } from "fs";
import { sortTree } from "../../common/sort-tree";
import { OrdoFolder } from "../types";
import { createOrdoFile } from "./create-ordo-file";
import { getFolderOrParent } from "./get-folder-or-parent";
import { join } from "path";

export const createFile = async (tree: OrdoFolder, parentPath: string, name: string): Promise<OrdoFolder> => {
	const parent = getFolderOrParent(tree, parentPath);
	const path = join(parent.path, name);

	if (parent.children.find((child) => child.path === path)) {
		return tree;
	}

	return promises
		.writeFile(path, "", "utf-8")
		.then(() => promises.stat(path))
		.then((stat) => {
			const node = createOrdoFile({
				depth: parent.depth + 1,
				createdAt: stat.birthtime,
				updatedAt: stat.mtime,
				accessedAt: stat.atime,
				path,
				relativePath: path.replace(tree.path, "."),
				size: stat.size,
			});

			parent.children.push(node);

			return sortTree(tree);
		});
};
