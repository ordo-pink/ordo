import { join, sep } from "path";
import { randomUUID } from "crypto";
import { existsSync, promises } from "fs";

import { OrdoEventHandler } from "@core/types";

/**
 * Creates a file with the path provided as payload.
 */
export const handleCreateFile: OrdoEventHandler<"@file-explorer/create-file"> = async ({ transmission, payload }) => {
	const { createFileIn, tree } = transmission.select((state) => state.fileExplorer);

	const path =
		typeof payload === "string"
			? join(createFileIn ? createFileIn : tree.path, payload)
			: join(payload.parentPath, payload.name);

	if (path === createFileIn) {
		return;
	}

	if (existsSync(path)) {
		return;
	}

	const parentPath = path.split(sep).slice(0, -1).join(sep);

	if (!existsSync(parentPath)) {
		await transmission.emit("@file-explorer/create-folder", parentPath);
	}

	const defaultConfig = {
		uuid: randomUUID(),
		color: "neutral",
		tags: [],
		embeds: [],
		links: [],
	};

	await promises.writeFile(
		path.indexOf(".") === -1 ? `${path.trim()}.md` : path.trim(),
		`---\n${JSON.stringify(defaultConfig)}\n---\n`,
		"utf-8",
	);

	await transmission.emit("@file-explorer/hide-creation", null);
	await transmission.emit("@file-explorer/list-folder", tree.path);

	if (typeof payload === "string") {
		await transmission.emit("@editor/open-tab", path);
	}
};
