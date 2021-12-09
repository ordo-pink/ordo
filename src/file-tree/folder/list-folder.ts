import { promises } from "fs";
import { join } from "path";
import YAML from "yaml";

import { createOrdoFolder } from "./create-folder";
import { createOrdoFile } from "../file/create-file";
import { FileTree, IFileTree } from "../file-tree";

export const listFolder = async (
	path: string,
	depth = 0,
	rootPath: string = path,
): Promise<IFileTree> => {
	const folder = await promises.readdir(path, { withFileTypes: true, encoding: "utf-8" });
	const { mtime, atime, birthtime } = await promises.stat(path);
	const readablePath = path.slice(path.lastIndexOf("/") + 1);

	const tree = createOrdoFolder({
		depth,
		path,
		readablePath,

		createdAt: birthtime,
		updatedAt: mtime,
		accessedAt: atime,
	});

	for (const item of folder) {
		const itemPath = join(path, item.name);

		if (item.isDirectory()) {
			const isHiddenDirectory = item.name.slice(item.name.lastIndexOf("/") + 1).startsWith(".");

			if (isHiddenDirectory) {
				continue;
			}

			(await listFolder(itemPath, depth + 1, rootPath)).getRoot().fold(
				() => null,
				(f) => tree.children.push(f),
			);
		} else if (item.isFile()) {
			if (item.name === ".ordo") {
				const content = await promises.readFile(itemPath, "utf-8");
				const dotOrdo = YAML.parse(content);

				Object.keys(dotOrdo).forEach((key) => {
					switch (key) {
						case "color":
							tree.color = dotOrdo.color;
							break;
						case "collapsed":
							tree.collapsed = dotOrdo.collapsed;
							break;
						default:
							break;
					}
				});
			}

			if (item.name.startsWith(".")) {
				// TODO Add configuration for hidden files and objects
				continue;
			}

			const { birthtime, mtime, atime, size } = await promises.stat(itemPath);
			const readablePath = itemPath.replace(rootPath, "").slice(1);
			const file = createOrdoFile({
				path: itemPath,
				depth: depth + 1,
				readablePath,
				createdAt: birthtime,
				updatedAt: mtime,
				accessedAt: atime,
				size,
			});

			tree.children.push(file);
		}
	}

	return FileTree.of(tree);
};
