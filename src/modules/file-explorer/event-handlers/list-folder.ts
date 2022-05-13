import { promises } from "fs";
import { join } from "path";
import { Minimatch } from "minimatch";

import { OrdoEventHandler } from "@core/types";
import { userSettingsStore } from "@core/settings/user-settings";
import { OrdoFolder } from "@modules/file-explorer/types";
import { createOrdoFile } from "@modules/file-explorer/utils/create-ordo-file";
import { createOrdoFolder } from "@modules/file-explorer/utils/create-ordo-folder";
import { sortTree } from "@modules/file-explorer/utils/sort-tree";

/**
 * Collects the list of all files and folders within the path.
 */
export const listFolder = async (path: string, depth = 0, rootPath = path): Promise<OrdoFolder> => {
	const folder = await promises.readdir(path, { withFileTypes: true, encoding: "utf-8" });
	const { mtime, atime, birthtime } = await promises.stat(path);

	const excludePatterns: string[] = userSettingsStore.store.explorer.exclude;

	const excluded = excludePatterns.map((pattern) => new Minimatch(pattern));

	const relativePath = path.replace(rootPath, "");
	const tree = createOrdoFolder({
		depth,
		path,
		relativePath,
		createdAt: birthtime,
		updatedAt: mtime,
		accessedAt: atime,
	});

	for (const item of folder) {
		const itemPath = join(path, item.name);

		if (excluded.some((mm) => mm.match(itemPath))) {
			continue;
		}

		if (item.isDirectory()) {
			tree.children.push(await listFolder(itemPath, depth + 1, rootPath));
		} else if (item.isFile()) {
			if (item.name === ".ordo") {
				const content = await promises.readFile(itemPath, "utf-8");
				const dotOrdo = JSON.parse(content);

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

				continue;
			}

			const { birthtime, mtime, atime, size } = await promises.stat(itemPath);
			const relativePath = itemPath.replace(rootPath, "");

			const file = createOrdoFile({
				path: itemPath,
				depth: depth + 1,
				relativePath,
				createdAt: birthtime,
				updatedAt: mtime,
				accessedAt: atime,
				size,
			});

			tree.children.push(file);
		}
	}

	return sortTree(tree);
};

export const handleListFolder: OrdoEventHandler<"@file-explorer/list-folder"> = async ({ draft, payload }) => {
	draft.fileExplorer.tree = await listFolder(payload);
};
