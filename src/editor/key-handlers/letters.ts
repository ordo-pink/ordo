import { ChangeResponse } from "../types";
import { moveCaretRight } from "./common";

export const handleTyping = (change: ChangeResponse): ChangeResponse => {
	const currentLine = change.content[change.selection.start.line];

	change.content[change.selection.start.line] =
		currentLine.slice(0, change.selection.start.index) +
		(change.keys.shiftKey ? change.keys.key.toLocaleUpperCase() : change.keys.key.toLocaleLowerCase()) +
		currentLine.slice(change.selection.start.index);

	change = moveCaretRight(change, null, true);

	return change;
};
