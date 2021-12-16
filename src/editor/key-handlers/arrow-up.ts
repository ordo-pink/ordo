import { ChangeResponse } from "../types";
import {
	isCaretAtLineStart,
	isCaretBeyondLineLength,
	isFirstLine,
	moveCaretToLineEnd,
	moveCaretToPreviousLine,
} from "./common";

export const handleArrowUp = (change: ChangeResponse): ChangeResponse => {
	if (isFirstLine(change) && isCaretAtLineStart(change)) {
		return change;
	}

	if (!isFirstLine(change)) {
		change = moveCaretToPreviousLine(change);

		if (isCaretBeyondLineLength(change)) {
			change = moveCaretToLineEnd(change);
		}
	}

	return change;
};
