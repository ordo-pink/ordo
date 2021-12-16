import { ChangeResponse } from "../types";
import { moveCaretRight } from "./common";

export const handleTyping = (change: ChangeResponse): ChangeResponse => {
	const currentLine = change.content[change.selection.line];

	change.content[change.selection.line] =
		currentLine.slice(0, change.selection.start) +
		(change.keys.shiftKey ? change.keys.key.toLocaleUpperCase() : change.keys.key.toLocaleLowerCase()) +
		currentLine.slice(change.selection.start);

	change = moveCaretRight(change);

	return change;
};
