import { EditorOrdoFile } from "./types";

export const getSelectionText = (file: EditorOrdoFile): string[] => {
	if (
		file.selection.start.line === file.selection.end.line &&
		file.selection.start.index === file.selection.end.index
	) {
		return file.body[file.selection.start.line];
	}

	if (file.selection.start.line === file.selection.end.line) {
		return file.body[file.selection.start.line].slice(file.selection.start.index, file.selection.end.index);
	}

	let text = [];

	text = file.body[file.selection.start.line].slice(file.selection.start.index);

	for (const line of file.body.slice(file.selection.start.line + 1, file.selection.end.line - 1)) {
		text = text.concat(line);
	}

	text = text.concat(file.body[file.selection.end.line].slice(0, file.selection.end.index));

	return text;
};

export const removeSelectionText = (file: EditorOrdoFile): void => {
	if (
		file.selection.start.line === file.selection.end.line &&
		file.selection.start.index === file.selection.end.index
	) {
		file.body.splice(file.selection.start.line, 1);
		file.selection.start.line--;
		file.selection.end = file.selection.start;
		file.selection.direction = "ltr";

		return;
	}

	if (file.selection.start.line === file.selection.end.line) {
		file.body[file.selection.start.line] = file.body[file.selection.start.line]
			.slice(0, file.selection.start.index)
			.concat(file.body[file.selection.start.line].slice(file.selection.end.index));

		file.selection.end = file.selection.start;
		file.selection.direction = "ltr";

		return;
	}

	file.body[file.selection.start.line] = file.body[file.selection.start.line]
		.slice(0, file.selection.start.index)
		.concat(file.body[file.selection.end.line].slice(file.selection.end.index));

	for (let i = file.selection.start.line + 1; i <= file.selection.end.line; i++) {
		file.body.splice(i, 1);
	}

	file.selection.end = file.selection.start;
	file.selection.direction = "ltr";
};
