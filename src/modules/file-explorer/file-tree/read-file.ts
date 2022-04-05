import { store } from "@core/config-store";
import { promises } from "fs";

export const readFile = async (path: string) => {
	const associations: any[] = store.get("explorer.associations");
	const extension = `.${path.split(".").reverse()[0]}`;

	const association = associations.find((a) => a.extension === extension);

	if (association.association === "image") {
		const content = await promises.readFile(path, "base64");
		return `data:image/${extension.slice(1)};base64,${content}`;
	}

	return promises.readFile(path, "utf-8");
};
