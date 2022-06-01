import { promises } from "fs";
import { randomUUID } from "crypto";

import { OrdoEventHandler } from "@core/types";
import { debounce } from "@utils/debounce";
import { findOrdoFile } from "../utils/find-ordo-file";

const debounceSave = debounce(async (path: string, content: string, callback: () => void = () => void 0) => {
	await promises.writeFile(path, content, "utf-8");
	callback();
});

/**
 * Saves file contents under given path. Saving is debounced for 500 milliseconds to avoid redundant
 * saves while typing.
 */
export const handleSaveFile: OrdoEventHandler<"@file-explorer/save-file"> = async ({
	payload,
	draft,
	transmission,
}) => {
	if (!payload) {
		const { currentTab } = transmission.select((state) => state.editor);
		const tab = draft.editor.tabs.find((t) => t.path === currentTab);
		const file = findOrdoFile(draft.fileExplorer.tree, "path", currentTab);

		if (!tab || !file) return;

		tab.raw = tab.content.raw;
		file.size = new TextEncoder().encode(tab.raw === "\n" ? "" : tab.raw).length;

		let fileContent = tab.content.raw;

		if (file.frontmatter) {
			if (!file.frontmatter.uuid) {
				file.frontmatter.uuid = file.uuid ?? randomUUID();
				console.log(file.uuid);
			}

			fileContent = "---\n".concat(JSON.stringify(file.frontmatter)).concat("\n---\n").concat(fileContent);
		}

		await promises.writeFile(tab.path, fileContent, "utf-8");

		tab.unsaved = false;
	} else {
		debounceSave(payload.path, payload.content);
	}
};
