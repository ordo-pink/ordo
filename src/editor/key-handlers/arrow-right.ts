import { ChangeResponse } from "../types";
import {
	getNextSpace,
	isCaretAtLineEnd,
	isLastLine,
	moveCaretRight,
	moveCaretToLineEnd,
	moveCaretToLineStart,
	moveCaretToNextLine,
} from "./common";

export const handleArrowRight = (change: ChangeResponse): ChangeResponse => {
	if (isLastLine(change) && isCaretAtLineEnd(change)) {
		return change;
	}

	if (isCaretAtLineEnd(change)) {
		change = moveCaretToNextLine(change);
		change = moveCaretToLineStart(change);

		return change;
	}

	if (change.keys.altKey) {
		const nextSpace = getNextSpace(change);

		if (~nextSpace) {
			const newPosition =
				change.selection.direction === "rtl"
					? nextSpace + change.selection.start.index + 1
					: nextSpace + change.selection.end.index + 1;
			change = moveCaretRight(change, newPosition);
		} else {
			change = moveCaretToLineEnd(change);
		}
	} else {
		change = moveCaretRight(change);
	}

	return change;
};
