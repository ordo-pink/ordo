import { OrdoEventHandler } from "@core/types";
import { findChar } from "@modules/editor/utils/find-char";

export const handleCopy: OrdoEventHandler<"@editor/copy"> = ({ transmission, context }) => {
	const tabs = transmission.select((state) => state.editor.tabs);
	const currentTab = transmission.select((state) => state.editor.currentTab);

	const tab = tabs.find((t) => t.path === currentTab);

	if (!tab) return;

	const markup = tab.caretPositions.map((position) => {
		const firstChar = findChar(tab.content, position.start.line, position.start.character);
		const lastChar = findChar(tab.content, position.end.line, position.end.character);

		return tab.content.raw.slice(firstChar?.position.offset ?? 0, lastChar?.position.offset ?? 0);
	});

	context.toClipboard(markup.join("\n"));
};
