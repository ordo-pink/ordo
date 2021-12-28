import { EditorOrdoFile } from "./types";

export const getSelectionText = (file: EditorOrdoFile): string => {
	if (
		file.selection.start.line === file.selection.end.line &&
		file.selection.start.index === file.selection.end.index
	) {
		return file.body[file.selection.start.line];
	}

	if (file.selection.start.line === file.selection.end.line) {
		return file.body[file.selection.start.line].slice(file.selection.start.index, file.selection.end.index);
	}

	let text = "";

	text += file.body[file.selection.start.line].slice(file.selection.start.index);

	for (const line of file.body.slice(file.selection.start.line + 1, file.selection.end.line - 1)) {
		text += line;
	}

	text += file.body[file.selection.end.line].slice(0, file.selection.end.index);

	return text;
};
