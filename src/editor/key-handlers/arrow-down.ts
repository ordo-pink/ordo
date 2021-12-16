import { ChangeResponse } from "../types";
import {
	isCaretAtLineEnd,
	isCaretBeyondLineLength,
	isLastLine,
	moveCaretToLineEnd,
	moveCaretToNextLine,
} from "./common";

export const handleArrowDown = (change: ChangeResponse): ChangeResponse => {
	if (isLastLine(change)) {
		if (!isCaretAtLineEnd(change)) {
			change = moveCaretToLineEnd(change);
		}
	} else {
		change = moveCaretToNextLine(change);

		if (isCaretBeyondLineLength(change)) {
			change = moveCaretToLineEnd(change);
		}
	}

	return change;
};
