import { EditorOrdoFile } from "../../common/types";
import { ChangeKeys } from "../types";
import { moveCaretRight } from "./common";

export const handleTyping = (change: EditorOrdoFile, keys: ChangeKeys): EditorOrdoFile => {
	const currentLine = change.body[change.selection.start.line];

	change.body[change.selection.start.line] = currentLine
		.slice(0, change.selection.start.index)
		.concat(keys.shiftKey ? keys.key.toLocaleUpperCase() : keys.key.toLocaleLowerCase())
		.concat(currentLine.slice(change.selection.start.index));

	change = moveCaretRight(change, keys, null, true);

	return change;
};
