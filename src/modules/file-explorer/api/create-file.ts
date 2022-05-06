import { promises, existsSync } from "fs";
import { join } from "path";

import { OrdoFolder } from "@modules/file-explorer/types";
import { createOrdoFile } from "@modules/file-explorer/utils/create-ordo-file";
import { sortTree } from "@modules/file-explorer/utils/sort-tree";
import { getFolderOrParent } from "@modules/file-explorer/utils/get-folder-or-parent";
import { createFolder } from "@modules/file-explorer/api/create-folder";

export const createFile = async (tree: OrdoFolder, parentPath: string, path: string): Promise<OrdoFolder> => {
	let parent = getFolderOrParent(tree, parentPath);

	if (!parent) {
		parent = await createFolder(tree, tree.path, parentPath.replace(tree.path, ""));
	}

	if (!parent) {
		throw new Error(`Could not create ${parentPath} folder`);
	}

	const fullPath = join(parentPath, path);

	if (existsSync(fullPath)) {
		return tree;
	}

	if (parent.children.find((child) => child.path === path)) {
		return tree;
	}

	return promises
		.writeFile(fullPath, "", "utf-8")
		.then(() => promises.stat(fullPath))
		.then((stat) => {
			const node = createOrdoFile({
				depth: (parent as any).depth + 1,
				createdAt: stat.birthtime,
				updatedAt: stat.mtime,
				accessedAt: stat.atime,
				path: fullPath,
				relativePath: fullPath.replace(tree.path, ""),
				size: stat.size,
			});

			(parent as any).children.push(node);

			return sortTree(tree);
		});
};
