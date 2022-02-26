import { promises } from "fs";
import { join } from "path";

import { sortTree } from "@core/sort-tree";
import { getFolderOrParent } from "@core/utils/get-folder-or-parent";
import { OrdoFolder } from "@modules/application/types";
import { createOrdoFile } from "@modules/application/create-ordo-file";

export const createFile = async (tree: OrdoFolder, parentPath: string, name: string): Promise<OrdoFolder | null> => {
	const parent = getFolderOrParent(tree, parentPath);

	if (!parent) {
		return null;
	}

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
