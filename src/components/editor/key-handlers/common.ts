import { OpenOrdoFile } from "../../../application/types";
import { KeysDown } from "../types";

export const getPreviousSpace = (edited: OpenOrdoFile): number =>
	edited.body[edited.selection.start.line]
		.slice(
			0,
			edited.selection.start.index < edited.selection.end.index && edited.selection.direction === "rtl"
				? edited.selection.start.index
				: edited.selection.end.index,
		)
		.lastIndexOf(" ");

export const getNextSpace = (edited: OpenOrdoFile): number =>
	edited.selection.start.index < edited.selection.end.index && edited.selection.direction === "rtl"
		? edited.body[edited.selection.start.line].slice(edited.selection.start.index).indexOf(" ")
		: edited.body[edited.selection.end.line].slice(edited.selection.end.index).indexOf(" ");

export const isFirstLine = (edited: OpenOrdoFile): boolean =>
	edited.selection.direction === "rtl" ? edited.selection.start.line === 0 : edited.selection.end.line === 0;
export const isLastLine = (edited: OpenOrdoFile): boolean =>
	edited.selection.direction === "rtl"
		? edited.selection.start.line === edited.body.length - 1
		: edited.selection.end.line === edited.body.length - 1;

export const isCaretAtLineStart = (edited: OpenOrdoFile): boolean =>
	edited.selection.direction === "rtl" ? edited.selection.start.index === 0 : edited.selection.end.index === 0;
export const isCaretAtLineEnd = (edited: OpenOrdoFile): boolean =>
	edited.selection.direction === "rtl"
		? edited.selection.start.index === edited.body[edited.selection.start.line].length - 1
		: edited.selection.end.index === edited.body[edited.selection.end.line].length - 1;

export const isWithinSelection = (edited: OpenOrdoFile): boolean =>
	edited.selection.end.index > edited.selection.start.index || edited.selection.end.line > edited.selection.start.line;

export const isCaretBeyondLineLength = (edited: OpenOrdoFile): boolean =>
	edited.selection.direction === "rtl"
		? edited.body[edited.selection.start.line].length < edited.selection.start.index
		: edited.body[edited.selection.end.line].length < edited.selection.end.index;

export const moveCaretToLineStart = (edited: OpenOrdoFile, keys: KeysDown, ignoreShift = false): OpenOrdoFile => {
	return moveCaretLeft(edited, keys, 0, ignoreShift);
};
export const moveCaretToLineEnd = (edited: OpenOrdoFile, keys: KeysDown, ignoreShift = false): OpenOrdoFile => {
	return moveCaretRight(
		edited,
		keys,
		edited.selection.direction === "rtl"
			? edited.body[edited.selection.start.line].length - 1
			: edited.body[edited.selection.end.line].length - 1,
		ignoreShift,
	);
};

export const moveCaretLeft = (
	edited: OpenOrdoFile,
	keys: KeysDown,
	position?: number,
	ignoreShift = false,
): OpenOrdoFile => {
	if (isWithinSelection(edited) && edited.selection.direction === "ltr") {
		edited.selection.end.index = position != null ? position : edited.selection.end.index - 1;

		if (!keys.shiftKey) {
			edited.selection.start.index = edited.selection.end.index;
			edited.selection.start.line = edited.selection.end.line;
		}
	} else {
		edited.selection.direction = "rtl";
		edited.selection.start.index = position != null ? position : edited.selection.start.index - 1;

		if (!keys.shiftKey || ignoreShift) {
			edited.selection.end.index = edited.selection.start.index;
			edited.selection.end.line = edited.selection.start.line;
		}
	}

	return edited;
};

export const moveCaretToPreviousLine = (edited: OpenOrdoFile, keys: KeysDown, ignoreShift = false): OpenOrdoFile => {
	if (isWithinSelection(edited) && edited.selection.direction === "ltr") {
		edited.selection.end.line -= 1;

		if (!keys.shiftKey) {
			edited.selection.start.index = edited.selection.end.index;
			edited.selection.start.line = edited.selection.end.line;
		}
	} else {
		edited.selection.direction = "rtl";
		edited.selection.start.line -= 1;

		if (!keys.shiftKey || ignoreShift) {
			edited.selection.end.index = edited.selection.start.index;
			edited.selection.end.line = edited.selection.start.line;
		}
	}

	return edited;
};

export const moveCaretRight = (
	edited: OpenOrdoFile,
	keys: KeysDown,
	position?: number,
	ignoreShift = false,
): OpenOrdoFile => {
	if (isWithinSelection(edited) && edited.selection.direction === "rtl") {
		edited.selection.start.index = position != null ? position : edited.selection.start.index + 1;

		if (!keys.shiftKey) {
			edited.selection.end.index = edited.selection.start.index;
			edited.selection.end.line = edited.selection.start.line;
		}
	} else {
		edited.selection.direction = "ltr";
		edited.selection.end.index = position != null ? position : edited.selection.end.index + 1;

		if (!keys.shiftKey || ignoreShift) {
			edited.selection.start.index = edited.selection.end.index;
			edited.selection.start.line = edited.selection.end.line;
		}
	}

	return edited;
};

export const moveCaretToNextLine = (edited: OpenOrdoFile, keys: KeysDown, ignoreShift = false): OpenOrdoFile => {
	if (isWithinSelection(edited) && edited.selection.direction === "rtl") {
		edited.selection.start.line += 1;

		if (!keys.shiftKey) {
			edited.selection.end.index = edited.selection.start.index;
			edited.selection.end.line = edited.selection.start.line;
		}
	} else {
		edited.selection.direction = "ltr";
		edited.selection.end.line += 1;

		if (!keys.shiftKey || ignoreShift) {
			edited.selection.start.index = edited.selection.end.index;
			edited.selection.start.line = edited.selection.end.line;
		}
	}

	return edited;
};
