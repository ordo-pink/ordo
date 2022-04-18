import { OpenOrdoFile } from "@modules/application/types";
import { KeysDown } from "@modules/editor/types";

export const handleEnter = (edited: OpenOrdoFile, keys: KeysDown): OpenOrdoFile => {
	let nextLineContent: string[] = [" "];

	if (edited.selection.start.line !== edited.selection.end.line) {
		const from = edited.selection.direction === "ltr" ? edited.selection.start.line : edited.selection.end.line;
		const to = edited.selection.direction === "ltr" ? edited.selection.end.line : edited.selection.start.line;

		edited.body[edited.selection.end.line] = edited.body[edited.selection.end.line].slice(edited.selection.end.index);

		if (to - from > 1) {
			edited.body.splice(from + 1, to - from - 1);
		}

		edited.selection.end.line = edited.selection.start.line = from;
	}

	if (
		edited.selection.start.line === edited.selection.end.line &&
		edited.selection.start.index !== edited.selection.end.index
	) {
		const from = edited.selection.direction === "ltr" ? edited.selection.start.index : edited.selection.end.index;
		const to = edited.selection.direction === "ltr" ? edited.selection.end.index : edited.selection.start.index;

		edited.body[edited.selection.start.line] = edited.body[edited.selection.start.line]
			.slice(0, from)
			.concat(edited.body[edited.selection.start.line].slice(to));
		edited.selection.start.index = edited.selection.end.index = from;
		edited.selection.direction = "ltr";
	}

	if (edited.body[edited.selection.start.line].length >= edited.selection.start.index + 1) {
		nextLineContent = edited.body[edited.selection.start.line].slice(edited.selection.start.index);
		edited.body[edited.selection.start.line] = edited.body[edited.selection.start.line]
			.slice(0, edited.selection.start.index)
			.concat([" "]);
	}

	if (!edited.body[edited.selection.start.line].length) {
		edited.body[edited.selection.start.line] = [" "];
	}

	edited.body.splice(edited.selection.start.line + 1, 0, nextLineContent);

	edited.selection.start.line = edited.selection.end.line = edited.selection.start.line + 1;
	edited.selection.start.index = edited.selection.end.index = 0;
	edited.selection.direction = "ltr";

	return edited;
};
