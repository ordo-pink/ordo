import { promises, createReadStream } from "fs";
import { join } from "path";
import { Minimatch } from "minimatch";
import { randomUUID } from "crypto";

import { OrdoEventHandler } from "@core/types";
import { userSettingsStore } from "@core/settings/user-settings";
import { OrdoFolder } from "@modules/file-explorer/types";
import { createOrdoFile } from "@modules/file-explorer/utils/create-ordo-file";
import { createOrdoFolder } from "@modules/file-explorer/utils/create-ordo-folder";
import { sortTree } from "@modules/file-explorer/utils/sort-tree";
import { extractFrontmatter } from "@modules/text-parser";
import { existsSync } from "original-fs";

/**
 * Collects the list of all files and folders within the path.
 */
export const listFolder = async (path: string, depth = 0, rootPath = path): Promise<OrdoFolder> => {
	const folder = await promises.readdir(path, { withFileTypes: true, encoding: "utf-8" });
	const { mtime, atime, birthtime } = await promises.stat(path);

	const excludePatterns: string[] = userSettingsStore.store.explorer.exclude;

	const excluded = excludePatterns.map((pattern) => new Minimatch(pattern));

	const relativePath = path.replace(rootPath, "");

	const folderConfigPath = join(path, ".ordo");

	if (!existsSync(folderConfigPath)) {
		const defaultConfig = {
			uuid: randomUUID(),
			color: "neutral",
			collapsed: false,
		};

		await promises.writeFile(folderConfigPath, JSON.stringify(defaultConfig), "utf8");
	}

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
						case "uuid":
							tree.uuid = dotOrdo.uuid;
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

			if (file.extension === ".md" && file.size > 0) {
				const input = createReadStream(file.path);
				let maybeRawFrontmatter: string = await new Promise((resolve) => {
					input.on("data", (chunk) => {
						input.close();
						resolve(chunk.toString("utf8"));
					});
				});

				file.frontmatter = extractFrontmatter(maybeRawFrontmatter).frontmatter;
				if (!file.frontmatter?.uuid) {
					if (!file.frontmatter) {
						file.frontmatter = {};
						file.frontmatter.uuid = randomUUID();
					}

					file.uuid = file.frontmatter.uuid;
				}
			}

			tree.children.push(file);
		}
	}

	return sortTree(tree);
};

export const handleListFolder: OrdoEventHandler<"@file-explorer/list-folder"> = async ({ draft, payload }) => {
	draft.fileExplorer.tree = await listFolder(payload);
};
