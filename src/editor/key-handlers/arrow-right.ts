import { ChangeResponse } from "../types";
import {
	getNextSpace,
	isCaretAtLineEnd,
	isLastLine,
	moveCaretRight,
	moveCaretToLineEnd,
	moveCaretToNextLine,
} from "./common";

export const handleArrowRight = (change: ChangeResponse): ChangeResponse => {
	if (isLastLine(change) && isCaretAtLineEnd(change)) {
		return change;
	}

	if (isCaretAtLineEnd(change)) {
		change = moveCaretToNextLine(change);
		change = moveCaretToLineEnd(change);

		return change;
	}

	if (change.keys.altKey) {
		const nextSpace = getNextSpace(change);

		if (~nextSpace) {
			change.selection.start.index = nextSpace + change.selection.start.index + 1;
		} else {
			change = moveCaretToLineEnd(change);
		}
	} else {
		change = moveCaretRight(change);
	}

	return change;
};
