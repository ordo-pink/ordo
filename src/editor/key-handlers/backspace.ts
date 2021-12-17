import { ChangeResponse } from "../types";
import {
	getPreviousSpace,
	isCaretAtLineStart,
	isFirstLine,
	moveCaretLeft,
	moveCaretToLineEnd,
	moveCaretToLineStart,
	moveCaretToPreviousLine,
} from "./common";

export const handleBackspace = (change: ChangeResponse): ChangeResponse => {
	if (isFirstLine(change) && isCaretAtLineStart(change)) {
		return change;
	}

	if (isCaretAtLineStart(change)) {
		change = moveCaretToPreviousLine(change);
		change = moveCaretToLineEnd(change);

		change.content[change.selection.start.line] += change.content[change.selection.start.line + 1];
		change.content.splice(change.selection.start.line + 1, 1);

		return change;
	}

	if (change.keys.altKey) {
		const prevSpace = getPreviousSpace(change);

		if (~prevSpace) {
			change.content[change.selection.start.line] =
				change.content[change.selection.start.line].substring(0, prevSpace) +
				change.content[change.selection.start.line].substring(change.selection.start.index);

			change.selection.start.index = prevSpace;
		} else {
			change.content[change.selection.start.line] = change.content[change.selection.start.line].slice(
				change.selection.start.index,
			);

			change = moveCaretToLineStart(change);
		}
	} else {
		change.content[change.selection.start.line] =
			change.content[change.selection.start.line].substring(0, change.selection.start.index - 1) +
			change.content[change.selection.start.line].substring(change.selection.start.index);

		change = moveCaretLeft(change);
	}

	return change;
};
