import { EditorOrdoFile } from "../../common/types";
import { ChangeKeys } from "../types";
import {
	isCaretAtLineEnd,
	isCaretBeyondLineLength,
	isLastLine,
	moveCaretToLineEnd,
	moveCaretToNextLine,
} from "./common";

export const handleArrowDown = (edited: EditorOrdoFile, keys: ChangeKeys): EditorOrdoFile => {
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
