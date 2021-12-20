import { promises } from "fs";
import { join } from "path";
import { getSettings } from "../../configuration/settings";
import { OrdoFile, OrdoFolder } from "../types";
import { createOrdoFolder } from "./create-ordo-folder";
import { Minimatch } from "minimatch";
import YAML from "yaml";
import { createOrdoFile } from "./create-ordo-file";

const isFolder = (x: OrdoFile | OrdoFolder): x is OrdoFolder => x.type === "folder";

const sortTree = (tree: OrdoFolder): OrdoFolder => {
	tree.children = tree.children.sort((a, b) => {
		if (isFolder(a)) {
			sortTree(a);
		}

		if (isFolder(b)) {
			sortTree(b);
		}

		if (!isFolder(a) && isFolder(b)) {
			return 1;
		}

		if (isFolder(a) && !isFolder(b)) {
			return -1;
		}

		return a.readableName.localeCompare(b.readableName);
	});

	return tree as OrdoFolder;
};

export const listFolder = async (path: string, depth = 0, rootPath = path): Promise<OrdoFolder> => {
	const folder = await promises.readdir(path, { withFileTypes: true, encoding: "utf-8" });
	const { mtime, atime, birthtime } = await promises.stat(path);

	const settings = getSettings();

	const excluded = settings.get("file-explorer.exclude").map((pattern) => new Minimatch(pattern));

	const relativePath = path.replace(rootPath, ".");
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

				continue;
			}

			const { birthtime, mtime, atime, size } = await promises.stat(itemPath);
			const relativePath = itemPath.replace(rootPath, ".");

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
