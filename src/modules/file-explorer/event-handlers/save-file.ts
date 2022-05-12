import { promises } from "fs";

import { OrdoEventHandler } from "@core/types";
import { debounce } from "@utils/debounce";

const debounceSave = debounce(async (path: string, content: string, callback: () => void = () => void 0) => {
	await promises.writeFile(path, content, "utf-8");
	callback();
});

export const handleSaveFile: OrdoEventHandler<"@file-explorer/save-file"> = async ({ payload }) => {
	const contentString = payload.content.map((line) => line.slice(0, -1)).join("\n");

	debounceSave(payload.path, contentString);
};
