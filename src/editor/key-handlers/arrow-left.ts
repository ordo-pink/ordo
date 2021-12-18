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

export const handleArrowLeft = (change: ChangeResponse): ChangeResponse => {
	if (isFirstLine(change) && isCaretAtLineStart(change)) {
		return change;
	}

	if (isCaretAtLineStart(change)) {
		change = moveCaretToPreviousLine(change);
		change = moveCaretToLineEnd(change);

		return change;
	}

	if (change.keys.altKey) {
		const prevSpace = getPreviousSpace(change);

		if (~prevSpace) {
			change = moveCaretLeft(change, prevSpace);
		} else {
			change = moveCaretToLineStart(change);
		}
	} else {
		change = moveCaretLeft(change);
	}

	return change;
};
