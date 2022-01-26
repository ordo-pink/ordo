import { OpenOrdoFile, KeysDown } from "../types";
import {
	isCaretAtLineStart,
	isCaretBeyondLineLength,
	isFirstLine,
	moveCaretToLineEnd,
	moveCaretToPreviousLine,
} from "./common";

export const handleArrowUp = (edited: OpenOrdoFile, keys: KeysDown): OpenOrdoFile => {
	if (isFirstLine(edited) && isCaretAtLineStart(edited)) {
		return edited;
	}

	if (!isFirstLine(edited)) {
		edited = moveCaretToPreviousLine(edited, keys);

		if (isCaretBeyondLineLength(edited)) {
			edited = moveCaretToLineEnd(edited, keys);
		}
	}

	return edited;
};
