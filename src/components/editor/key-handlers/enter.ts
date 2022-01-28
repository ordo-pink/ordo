import { OpenOrdoFile } from "../../../application/types";
import { KeysDown } from "../types";
import { moveCaretToLineStart, moveCaretToNextLine } from "./common";

export const handleEnter = (edited: OpenOrdoFile, keys: KeysDown): OpenOrdoFile => {
	let nextLineContent: string[] = [" "];

	if (edited.body[edited.selection.start.line].length >= edited.selection.start.index + 1) {
		nextLineContent = edited.body[edited.selection.start.line].slice(edited.selection.start.index);
		edited.body[edited.selection.start.line] = edited.body[edited.selection.start.line].slice(
			0,
			edited.selection.start.index + 1,
		);
	}

	edited.body.splice(edited.selection.start.line + 1, 0, nextLineContent);
	edited = moveCaretToNextLine(edited, keys, true);
	edited = moveCaretToLineStart(edited, keys, true);

	return edited;
};
