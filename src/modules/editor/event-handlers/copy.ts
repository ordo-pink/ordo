import { OrdoEventHandler } from "@core/types";
import { findChar } from "@modules/editor/utils/find-char";

export const handleCopy: OrdoEventHandler<"@editor/copy"> = ({ transmission, context }) => {
	const tabs = transmission.select((state) => state.editor.tabs);
	const currentTab = transmission.select((state) => state.editor.currentTab);

	const tab = tabs.find((t) => t.path === currentTab);

	if (!tab) return;

	const text = tab.raw.split("\n").slice(3).join("\n");

	const markup = tab.caretPositions.map((position) => {
		const firstChar = findChar(tab.content, position.start.line, position.start.character);
		const lastChar = findChar(tab.content, position.end.line, position.end.character);

		console.log(firstChar?.position, lastChar?.position);

		return text.slice(firstChar?.position.offset ?? 0, lastChar?.position.offset ?? 0);
	});

	context.toClipboard(markup.join("\n"));
};
