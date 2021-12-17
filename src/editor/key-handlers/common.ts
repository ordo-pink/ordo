import { ChangeResponse } from "../types";

export const getPreviousSpace = (change: ChangeResponse): number =>
	change.content[change.selection.start.line].slice(0, change.selection.start.index).lastIndexOf(" ");

export const getNextSpace = (change: ChangeResponse): number =>
	change.content[change.selection.start.line].slice(change.selection.start.index).indexOf(" ");

export const isFirstLine = (change: ChangeResponse): boolean => change.selection.start.line === 0;
export const isLastLine = (change: ChangeResponse): boolean =>
	change.selection.start.line === change.content.length - 1;

export const isCaretAtLineStart = (change: ChangeResponse): boolean => change.selection.start.index === 0;
export const isCaretAtLineEnd = (change: ChangeResponse): boolean =>
	change.selection.start.index === change.content[change.selection.start.line].length - 1;

export const isCaretBeyondLineLength = (change: ChangeResponse): boolean =>
	change.content[change.selection.start.line].length <= change.selection.start.index;

export const moveCaretRight = (change: ChangeResponse): ChangeResponse => {
	change.selection.start.index += 1;
	return change;
};
export const moveCaretLeft = (change: ChangeResponse): ChangeResponse => {
	change.selection.start.index -= 1;
	return change;
};

export const moveCaretToLineStart = (change: ChangeResponse): ChangeResponse => {
	change.selection.start.index = 0;
	return change;
};
export const moveCaretToLineEnd = (change: ChangeResponse): ChangeResponse => {
	change.selection.start.index = change.content[change.selection.start.line].length - 1;
	return change;
};

export const moveCaretToPreviousLine = (change: ChangeResponse): ChangeResponse => {
	change.selection.start.line -= 1;
	return change;
};
export const moveCaretToNextLine = (change: ChangeResponse): ChangeResponse => {
	change.selection.start.line += 1;
	return change;
};
