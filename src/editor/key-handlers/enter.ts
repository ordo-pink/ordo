import { EditorOrdoFile } from "../../common/types";
import { ChangeKeys } from "../types";
import { moveCaretToLineStart, moveCaretToNextLine } from "./common";

export const handleEnter = (edited: EditorOrdoFile, keys: ChangeKeys): EditorOrdoFile => {
	let nextLineContent: string[];

	if (edited.body[edited.selection.start.line].length >= edited.selection.start.index) {
		nextLineContent = edited.body[edited.selection.start.line].slice(edited.selection.start.index);
		edited.body[edited.selection.start.line] = edited.body[edited.selection.start.line]
			.slice(0, edited.selection.start.index)
			.concat(["\n"]);
	}

	edited.body.splice(edited.selection.start.line + 1, 0, nextLineContent);
	edited = moveCaretToNextLine(edited, keys, true);
	edited = moveCaretToLineStart(edited, keys, true);

	return edited;
};
