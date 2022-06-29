import { promises } from "fs";

import { userSettingsStore } from "@core/settings/user-settings";

export const readFile = async (path: string) => {
	const { associations } = userSettingsStore.get("explorer");
	const extension = `.${path.split(".").reverse()[0]}`;

	const association = associations.find((a) => a.extension === extension);

	if (association && association.association === "image") {
		const content = await promises.readFile(path, "base64");
		return `data:image/${extension.slice(1)};base64,${content}`;
	}

	if (association) return promises.readFile(path, "utf-8");
};
