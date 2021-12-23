import { EditorOrdoFile } from "../../common/types";
import { ChangeKeys } from "../types";
import {
	getNextSpace,
	isCaretAtLineEnd,
	isLastLine,
	moveCaretRight,
	moveCaretToLineEnd,
	moveCaretToLineStart,
	moveCaretToNextLine,
} from "./common";

export const handleArrowRight = (edited: EditorOrdoFile, keys: ChangeKeys): EditorOrdoFile => {
	if (isLastLine(edited) && isCaretAtLineEnd(edited)) {
		return edited;
	}

	if (isCaretAtLineEnd(edited)) {
		edited = moveCaretToNextLine(edited, keys);
		edited = moveCaretToLineStart(edited, keys);

		return edited;
	}

	if (keys.altKey) {
		const nextSpace = getNextSpace(edited);

		if (~nextSpace) {
			const newPosition =
				edited.selection.direction === "rtl"
					? nextSpace + edited.selection.start.index + 1
					: nextSpace + edited.selection.end.index + 1;
			edited = moveCaretRight(edited, keys, newPosition);
		} else {
			edited = moveCaretToLineEnd(edited, keys);
		}
	} else {
		edited = moveCaretRight(edited, keys);
	}

	return edited;
};
