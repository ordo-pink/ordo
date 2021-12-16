import { ChangeResponse } from "../types";

export const getPreviousSpace = (change: ChangeResponse): number =>
	change.content[change.selection.line].slice(0, change.selection.start).lastIndexOf(" ");

export const getNextSpace = (change: ChangeResponse): number =>
	change.content[change.selection.line].slice(change.selection.start).indexOf(" ");

export const isFirstLine = (change: ChangeResponse): boolean => change.selection.line === 0;
export const isLastLine = (change: ChangeResponse): boolean => change.selection.line === change.content.length - 1;

export const isCaretAtLineStart = (change: ChangeResponse): boolean => change.selection.start === 0;
export const isCaretAtLineEnd = (change: ChangeResponse): boolean =>
	change.selection.start === change.content[change.selection.line].length - 1;

export const isCaretBeyondLineLength = (change: ChangeResponse): boolean =>
	change.content[change.selection.line].length <= change.selection.start;

export const moveCaretRight = (change: ChangeResponse): ChangeResponse => {
	change.selection.start += 1;
	return change;
};
export const moveCaretLeft = (change: ChangeResponse): ChangeResponse => {
	change.selection.start -= 1;
	return change;
};

export const moveCaretToLineStart = (change: ChangeResponse): ChangeResponse => {
	change.selection.start = 0;
	return change;
};
export const moveCaretToLineEnd = (change: ChangeResponse): ChangeResponse => {
	change.selection.start = change.content[change.selection.line].length - 1;
	return change;
};

export const moveCaretToPreviousLine = (change: ChangeResponse): ChangeResponse => {
	change.selection.line -= 1;
	return change;
};
export const moveCaretToNextLine = (change: ChangeResponse): ChangeResponse => {
	change.selection.line += 1;
	return change;
};
