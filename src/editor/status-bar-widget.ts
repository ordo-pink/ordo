import { StatusBarItem } from "../status-bar/state";
import { OrdoFile } from "../explorer/types";
import { ChangeSelection } from "./types";

const STATUS_BAR_LANGUAGE_ID = "EDITOR_LANGUAGE";

export const getLanguageModeWidget = (file?: OrdoFile): StatusBarItem => {
	const widget: StatusBarItem = {
		id: STATUS_BAR_LANGUAGE_ID,
		position: "right",
		value: "Text",
	};

	if (file.type === "image") {
		widget.value = "Image";
	}

	widget.value = `{} ${widget.value}`;

	return widget;
};

export const getStatusBarWidget = (change: { selection: ChangeSelection; content: string[] }): string => {
	const line = change.selection.direction === "rtl" ? change.selection.start.line : change.selection.end.line;
	const index = change.selection.direction === "rtl" ? change.selection.start.index : change.selection.end.index;

	let selected = 0;

	if (
		change.selection.start.index !== change.selection.end.index ||
		change.selection.start.line !== change.selection.end.line
	) {
		if (change.selection.start.line === change.selection.end.line) {
			selected += Math.abs(
				change.selection.direction === "ltr"
					? change.selection.end.index - change.selection.start.index
					: change.selection.start.index - change.selection.end.index,
			);
		} else {
			selected += change.selection.end.index;

			for (const line of change.content.slice(change.selection.start.line + 1, change.selection.end.line)) {
				selected += line.length;
			}

			selected += change.content[change.selection.start.line].length - change.selection.start.index;
		}
	}

	return `Ln ${line}, Col ${index}${selected !== 0 ? ` (${selected} selected)` : ""}`;
};
