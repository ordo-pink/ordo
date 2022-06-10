import { OrdoEventHandler } from "@core/types";

export const handleUpdateCaretPositions: OrdoEventHandler<"@editor/update-caret-positions"> = ({ draft, payload }) => {
	const tab = draft.editor.tabs.find((t) => t.path === payload.path);

	if (!tab) {
		return;
	}

	tab.caretPositions = payload.positions;
	if (!draft.editor.focused) {
		draft.editor.focused = true;
	}
};
