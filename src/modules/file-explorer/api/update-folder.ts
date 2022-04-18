import { join } from "path";
import { promises } from "fs";
import { OrdoFolder } from "@modules/file-explorer/types";

export const updateFolder = (path: string, update: Partial<OrdoFolder>): void => {
	const folder = {} as OrdoFolder;
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
		const dotOrdoPath = join(path, ".ordo");

		promises
			.readFile(dotOrdoPath, "utf-8")
			.then(JSON.parse)
			.then((data) => promises.writeFile(dotOrdoPath, JSON.stringify({ ...data, ...dotOrdo }, null, 2)))
			.catch(() => promises.writeFile(dotOrdoPath, JSON.stringify(dotOrdo, null, 2)));
	}
};
