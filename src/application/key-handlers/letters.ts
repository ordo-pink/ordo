import { OpenOrdoFile, KeysDown } from "../types";
import { moveCaretRight } from "./common";

export const handleTyping = (change: OpenOrdoFile, keys: KeysDown): OpenOrdoFile => {
	const currentLine = change.body[change.selection.start.line];

	change.body[change.selection.start.line] = currentLine
		.slice(0, change.selection.start.index)
		.concat(keys.shiftKey ? keys.key.toLocaleUpperCase() : keys.key.toLocaleLowerCase())
		.concat(currentLine.slice(change.selection.start.index));

	change = moveCaretRight(change, keys, undefined, true);

	return change;
};
