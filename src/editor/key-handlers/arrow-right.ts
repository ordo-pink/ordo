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

	if (
		isCaretAtLineEnd(edited) ||
		edited.selection.start.index >= edited.body[edited.selection.start.line].length ||
		edited.selection.end.index >= edited.body[edited.selection.end.line].length
	) {
		edited = moveCaretToNextLine(edited, keys);
		edited = moveCaretToLineStart(edited, keys);

		return edited;
	}

	if (keys.altKey) {
		edited = moveCaretRight(edited, keys);

		const nextSpace = getNextSpace(edited);

		if (~nextSpace) {
			const newPosition =
				edited.selection.direction === "rtl"
					? nextSpace + edited.selection.start.index
					: nextSpace + edited.selection.end.index;
			edited = moveCaretRight(edited, keys, newPosition);
		} else {
			edited = moveCaretToLineEnd(edited, keys);
		}
	} else {
		edited = moveCaretRight(edited, keys);
	}

	return edited;
};
