import { promises } from "fs";

import { OrdoEventHandler } from "@core/types";
import { debounce } from "@utils/debounce";

const debounceSave = debounce(async (path: string, content: string, callback: () => void = () => void 0) => {
	await promises.writeFile(path, content, "utf-8");
	callback();
});

/**
 * Saves file contents under given path. Saving is debounced for 500 milliseconds to avoid redundant
 * saves while typing.
 */
export const handleSaveFile: OrdoEventHandler<"@file-explorer/save-file"> = async ({ payload, transmission }) => {
	if (!payload) {
		const { currentTab, tabs } = transmission.select((state) => state.editor);
		const tab = tabs.find((t) => t.path === currentTab);

		if (!tab) return;

		await promises.writeFile(tab.path, tab.content.raw, "utf-8");
	} else {
		debounceSave(payload.path, payload.content);
	}
};
