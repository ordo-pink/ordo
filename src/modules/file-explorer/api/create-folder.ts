import { promises, existsSync } from "fs";
import { join } from "path";
import { OrdoFolder } from "@modules/file-explorer/types";
import { createOrdoFolder } from "@modules/file-explorer/utils/create-ordo-folder";
import { getFolderOrParent } from "@modules/file-explorer/utils/get-folder-or-parent";
import { sortTree } from "@modules/file-explorer/utils/sort-tree";

export const createFolder = async (tree: OrdoFolder, parentPath: string, name: string): Promise<OrdoFolder> => {
	const parent = getFolderOrParent(tree, parentPath);

	if (!parent) {
		throw new Error("Could not find the folder or file parent folder");
	}

	const path = join(parent.path, name);

	if (existsSync(path)) {
		return tree;
	}

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
