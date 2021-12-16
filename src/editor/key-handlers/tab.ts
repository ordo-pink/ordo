import { ChangeResponse } from "../types";
import { moveCaretLeft } from "./common";
import { handleTyping } from "./letters";

export const handleTab = (change: ChangeResponse): ChangeResponse => {
	if (change.keys.shiftKey) {
		if (change.content[change.selection.line].startsWith(" ")) {
			change.content[change.selection.line] = change.content[change.selection.line].slice(1);
			change = moveCaretLeft(change);
		}

		return change;
	}

	change.keys.key = " ";

	return handleTyping(change);
};
