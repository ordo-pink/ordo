import { EditorOrdoFile } from "../../common/types";
import { ChangeKeys } from "../types";
import {
	isCaretAtLineStart,
	isCaretBeyondLineLength,
	isFirstLine,
	moveCaretToLineEnd,
	moveCaretToPreviousLine,
} from "./common";

export const handleArrowUp = (edited: EditorOrdoFile, keys: ChangeKeys): EditorOrdoFile => {
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
