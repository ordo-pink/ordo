import { OrdoEventHandler } from "@core/types";
import { parseText } from "@modules/text-parser";
import { findChar } from "../utils/find-char";

export const handleCut: OrdoEventHandler<"@editor/cut"> = ({ draft, context, transmission }) => {
	const tabs = draft.editor.tabs;
	const currentTab = draft.editor.currentTab;

	const tab = tabs.find((t) => t.path === currentTab);

	if (!tab) return;

	let clipboard: string[] = [];

	const original = tab.content.raw;

	tab.caretPositions.reverse().forEach((position) => {
		const firstChar = findChar(tab.content, position.start.line, position.start.character);
		const lastChar = findChar(tab.content, position.end.line, position.end.character);

		if (
			!firstChar ||
			!lastChar ||
			(firstChar.position.line === lastChar.position.line && firstChar.position.character === lastChar.position.character)
		) {
			return;
		}

		clipboard.push(tab.content.raw.slice(firstChar.position.offset, lastChar.position.offset));

		tab.content.raw = tab.content.raw
			.slice(0, firstChar.position.offset)
			.concat(tab.content.raw.slice(lastChar.position.offset));

		position.start.line = position.end.line = firstChar.position.line;
		position.start.character = position.end.character = firstChar.position.character;
	});

	if (tab.content.raw !== original) {
		tab.content.children = [];
		parseText(tab.content.raw, tab.content);

		context.toClipboard(clipboard.join("\n"));

		transmission.emit("@file-explorer/save-file", { path: currentTab, content: tab.content.raw });
	}
};
