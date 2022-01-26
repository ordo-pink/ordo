import { OpenOrdoFile, KeysDown } from "../types";

import {
	getPreviousSpace,
	isCaretAtLineStart,
	isFirstLine,
	moveCaretLeft,
	moveCaretToLineEnd,
	moveCaretToLineStart,
	moveCaretToPreviousLine,
} from "./common";

export const handleArrowLeft = (edited: OpenOrdoFile, keys: KeysDown): OpenOrdoFile => {
	if (
		isFirstLine(edited) &&
		(isCaretAtLineStart(edited) || edited.selection.start.index < 0 || edited.selection.end.index < 0)
	) {
		return edited;
	}

	if (isCaretAtLineStart(edited) || edited.selection.start.index < 0 || edited.selection.end.index < 0) {
		edited = moveCaretToPreviousLine(edited, keys);
		edited = moveCaretToLineEnd(edited, keys);

		return edited;
	}

	if (keys.altKey) {
		edited = moveCaretLeft(edited, keys);

		const prevSpace = getPreviousSpace(edited);

		if (~prevSpace) {
			edited = moveCaretLeft(edited, keys, prevSpace + 1);
		} else {
			edited = moveCaretToLineStart(edited, keys);
		}
	} else {
		edited = moveCaretLeft(edited, keys);
	}

	return edited;
};
