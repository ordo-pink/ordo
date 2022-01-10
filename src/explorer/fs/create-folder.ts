import { promises } from "fs";
import { sortTree } from "../../common/sort-tree";
import { OrdoFolder } from "../types";
import { createOrdoFolder } from "./create-ordo-folder";
import { getFolderOrParent } from "./get-folder-or-parent";
import { join } from "path";

export const createFolder = async (tree: OrdoFolder, parentPath: string, name: string): Promise<OrdoFolder> => {
	const parent = getFolderOrParent(tree, parentPath);
	const path = join(parent.path, name);

	if (parent.children.find((child) => child.path === path)) {
		return tree;
	}

	return promises
		.mkdir(path, { recursive: true })
		.then(() => promises.stat(path))
		.then((stat) => {
			const node = createOrdoFolder({
				depth: parent.depth + 1,
				createdAt: stat.birthtime,
				updatedAt: stat.mtime,
				accessedAt: stat.atime,
				path,
				relativePath: path.replace(tree.path, "."),
			});

			parent.children.push(node);

			return sortTree(tree);
		});
};
