import { ChangeResponse } from "../types";
import { moveCaretToLineStart, moveCaretToNextLine } from "./common";

export const handleEnter = (change: ChangeResponse): ChangeResponse => {
	let nextLineContent = "\n";

	if (change.content[change.selection.line].length >= change.selection.start) {
		nextLineContent = change.content[change.selection.line].slice(change.selection.start);
		change.content[change.selection.line] =
			change.content[change.selection.line].slice(0, change.selection.start) + "\n";
	}

	change.content.splice(change.selection.line + 1, 0, nextLineContent);
	change = moveCaretToNextLine(change);
	change = moveCaretToLineStart(change);

	return change;
};
