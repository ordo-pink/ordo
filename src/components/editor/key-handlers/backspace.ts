import { OpenOrdoFile } from "../../../application/types";
import { KeysDown } from "../types";
import {
	getPreviousSpace,
	isCaretAtLineStart,
	isFirstLine,
	moveCaretLeft,
	moveCaretToLineEnd,
	moveCaretToLineStart,
	moveCaretToPreviousLine,
} from "./common";

export const handleBackspace = (change: OpenOrdoFile, keys: KeysDown): OpenOrdoFile => {
	if (isFirstLine(change) && isCaretAtLineStart(change)) {
		return change;
	}

	if (isCaretAtLineStart(change)) {
		change = moveCaretToPreviousLine(change, keys, true);
		change = moveCaretToLineEnd(change, keys, true);

		change.body[change.selection.start.line] = change.body[change.selection.start.line].concat(
			change.body[change.selection.start.line + 1],
		);
		change.body.splice(change.selection.start.line + 1, 1);

		return change;
	}

	if (keys.altKey) {
		const prevSpace = getPreviousSpace(change);

		if (~prevSpace) {
			change.body[change.selection.start.line] = change.body[change.selection.start.line]
				.slice(0, prevSpace)
				.concat(change.body[change.selection.start.line].slice(change.selection.start.index));

			change.selection.start.index = prevSpace;
		} else {
			change.body[change.selection.start.line] = change.body[change.selection.start.line].slice(
				change.selection.start.index,
			);

			change = moveCaretToLineStart(change, keys, true);
		}
	} else {
		change.body[change.selection.start.line] = change.body[change.selection.start.line]
			.slice(0, change.selection.start.index - 1)
			.concat(change.body[change.selection.start.line].slice(change.selection.start.index));

		change = moveCaretLeft(change, keys, undefined, true);
	}

	return change;
};
