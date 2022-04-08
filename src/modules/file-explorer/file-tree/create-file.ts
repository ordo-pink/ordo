import { promises } from "fs";
import { createOrdoFile } from "./create-ordo-file";
import { join } from "path";
import { OrdoFolder } from "@modules/editor/editor-slice";
import { sortTree } from "./sort-tree";
import { getFolderOrParent } from "./get-folder-or-parent";
import { createFolder } from "./create-folder";

export const createFile = async (tree: OrdoFolder, path: string): Promise<OrdoFolder> => {
	const parentPath = path.includes("/") ? join(tree.path, path.slice(0, path.lastIndexOf("/"))) : tree.path;
	let parent = getFolderOrParent(tree, parentPath);

	if (!parent) {
		parent = await createFolder(tree, tree.path, parentPath.replace(tree.path, ""));
	}

	if (!parent) {
		throw new Error(`Could not create ${parentPath} folder`);
	}

	const fullPath = join(tree.path, path);

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
				relativePath: fullPath.replace(tree.path, "."),
				size: stat.size,
			});

			(parent as any).children.push(node);

			return sortTree(tree);
		});
};
