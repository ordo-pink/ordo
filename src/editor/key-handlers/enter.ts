import { ChangeResponse } from "../types";
import { moveCaretToLineStart, moveCaretToNextLine } from "./common";

export const handleEnter = (change: ChangeResponse): ChangeResponse => {
	let nextLineContent = "\n";

	if (change.content[change.selection.start.line].length >= change.selection.start.index) {
		nextLineContent = change.content[change.selection.start.line].slice(change.selection.start.index);
		change.content[change.selection.start.line] =
			change.content[change.selection.start.line].slice(0, change.selection.start.index) + "\n";
	}

	change.content.splice(change.selection.start.line + 1, 0, nextLineContent);
	change = moveCaretToNextLine(change);
	change = moveCaretToLineStart(change);

	return change;
};
