import { ChangeResponse } from "../types";

export const getPreviousSpace = (change: ChangeResponse): number =>
	change.content[change.selection.start.line]
		.slice(
			0,
			change.selection.start.index < change.selection.end.index && change.selection.direction === "rtl"
				? change.selection.start.index
				: change.selection.end.index,
		)
		.lastIndexOf(" ");

export const getNextSpace = (change: ChangeResponse): number =>
	change.selection.start.index < change.selection.end.index && change.selection.direction === "rtl"
		? change.content[change.selection.start.line].slice(change.selection.start.index).indexOf(" ")
		: change.content[change.selection.end.line].slice(change.selection.end.index).indexOf(" ");

export const isFirstLine = (change: ChangeResponse): boolean =>
	change.selection.direction === "rtl" ? change.selection.start.line === 0 : change.selection.end.line === 0;
export const isLastLine = (change: ChangeResponse): boolean =>
	change.selection.direction === "rtl"
		? change.selection.start.line === change.content.length - 1
		: change.selection.end.line === change.content.length - 1;

export const isCaretAtLineStart = (change: ChangeResponse): boolean =>
	change.selection.direction === "rtl" ? change.selection.start.index === 0 : change.selection.end.index === 0;
export const isCaretAtLineEnd = (change: ChangeResponse): boolean =>
	change.selection.direction === "rtl"
		? change.selection.start.index === change.content[change.selection.start.line].length - 1
		: change.selection.end.index === change.content[change.selection.end.line].length - 1;

export const isWithinSelection = (change: ChangeResponse): boolean =>
	change.selection.end.index > change.selection.start.index || change.selection.end.line > change.selection.start.line;

export const isCaretBeyondLineLength = (change: ChangeResponse): boolean =>
	change.selection.direction === "rtl"
		? change.content[change.selection.start.line].length < change.selection.start.index
		: change.content[change.selection.end.line].length < change.selection.end.index;

export const moveCaretToLineStart = (change: ChangeResponse, ignoreShift = false): ChangeResponse => {
	return moveCaretLeft(change, 0, ignoreShift);
};
export const moveCaretToLineEnd = (change: ChangeResponse, ignoreShift = false): ChangeResponse => {
	return moveCaretRight(
		change,
		change.selection.direction === "rtl"
			? change.content[change.selection.start.line].length - 1
			: change.content[change.selection.end.line].length - 1,
		ignoreShift,
	);
};

export const moveCaretLeft = (change: ChangeResponse, position?: number, ignoreShift = false): ChangeResponse => {
	if (isWithinSelection(change) && change.selection.direction === "ltr") {
		change.selection.end.index = position != null ? position : change.selection.end.index - 1;

		if (!change.keys.shiftKey) {
			change.selection.start.index = change.selection.end.index;
			change.selection.start.line = change.selection.end.line;
		}
	} else {
		change.selection.direction = "rtl";
		change.selection.start.index = position != null ? position : change.selection.start.index - 1;

		if (!change.keys.shiftKey || ignoreShift) {
			change.selection.end.index = change.selection.start.index;
			change.selection.end.line = change.selection.start.line;
		}
	}

	return change;
};

export const moveCaretToPreviousLine = (change: ChangeResponse, ignoreShift = false): ChangeResponse => {
	if (isWithinSelection(change) && change.selection.direction === "ltr") {
		change.selection.end.line -= 1;

		if (!change.keys.shiftKey) {
			change.selection.start.index = change.selection.end.index;
			change.selection.start.line = change.selection.end.line;
		}
	} else {
		change.selection.direction = "rtl";
		change.selection.start.line -= 1;

		if (!change.keys.shiftKey || ignoreShift) {
			change.selection.end.index = change.selection.start.index;
			change.selection.end.line = change.selection.start.line;
		}
	}

	return change;
};

export const moveCaretRight = (change: ChangeResponse, position?: number, ignoreShift = false): ChangeResponse => {
	if (isWithinSelection(change) && change.selection.direction === "rtl") {
		change.selection.start.index = position != null ? position : change.selection.start.index + 1;

		if (!change.keys.shiftKey) {
			change.selection.end.index = change.selection.start.index;
			change.selection.end.line = change.selection.start.line;
		}
	} else {
		change.selection.direction = "ltr";
		change.selection.end.index = position != null ? position : change.selection.end.index + 1;

		if (!change.keys.shiftKey || ignoreShift) {
			change.selection.start.index = change.selection.end.index;
			change.selection.start.line = change.selection.end.line;
		}
	}

	return change;
};

export const moveCaretToNextLine = (change: ChangeResponse, ignoreShift = false): ChangeResponse => {
	if (isWithinSelection(change) && change.selection.direction === "rtl") {
		change.selection.start.line += 1;

		if (!change.keys.shiftKey) {
			change.selection.end.index = change.selection.start.index;
			change.selection.end.line = change.selection.start.line;
		}
	} else {
		change.selection.direction = "ltr";
		change.selection.end.line += 1;

		if (!change.keys.shiftKey || ignoreShift) {
			change.selection.start.index = change.selection.end.index;
			change.selection.start.line = change.selection.end.line;
		}
	}

	return change;
};
