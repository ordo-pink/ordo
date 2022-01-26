import { OrdoFolder } from "../types";
import { getFolder } from "../utils/get-folder";
import { join } from "path";
import { promises } from "fs";
import YAML from "yaml";

export const updateFolder = (tree: OrdoFolder, path: string, update: Partial<OrdoFolder>): OrdoFolder => {
	const folder = getFolder(tree, path);

	if (!folder) {
		return tree;
	}

	const props = Object.keys(update);
	const dotOrdo: Partial<OrdoFolder> = {};

	if (props.includes("color")) {
		dotOrdo.color = update.color;
	}

	if (props.includes("collapsed")) {
		dotOrdo.collapsed = update.collapsed;
	}

	Object.keys(update).forEach((key) => {
		(folder as any)[key] = (update as any)[key];
	});

	if (Object.keys(dotOrdo).length) {
		const dotOrdoPath = join(folder.path, ".ordo");

		promises
			.readFile(dotOrdoPath, "utf-8")
			.then(YAML.parse)
			.then((data) => promises.writeFile(dotOrdoPath, YAML.stringify({ ...data, ...dotOrdo })))
			.catch(() => promises.writeFile(dotOrdoPath, YAML.stringify(dotOrdo)));
	}

	return tree;
};
