import { OpenOrdoFile, KeysDown } from "../types";
import {
	isCaretAtLineEnd,
	isCaretBeyondLineLength,
	isLastLine,
	moveCaretToLineEnd,
	moveCaretToNextLine,
} from "./common";

export const handleArrowDown = (edited: OpenOrdoFile, keys: KeysDown): OpenOrdoFile => {
	if (isLastLine(edited)) {
		if (!isCaretAtLineEnd(edited)) {
			edited = moveCaretToLineEnd(edited, keys);
		}
	} else {
		edited = moveCaretToNextLine(edited, keys);

		if (isCaretBeyondLineLength(edited)) {
			edited = moveCaretToLineEnd(edited, keys);
		}
	}

	return edited;
};
