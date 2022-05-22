import { DocumentRoot } from "@core/parser/types";
import { OrdoEvent } from "@core/types";
import { OrdoFile } from "@modules/file-explorer/types";

export type CaretPosition = {
	line: number;
	character: number;
};

export type CaretRange = {
	start: CaretPosition;
	end: CaretPosition;
	direction: "ltr" | "rtl";
};

export type EditorTab = Required<Pick<OrdoFile, "path" | "raw">> & {
	caretPositions: CaretRange[];
	content: DocumentRoot;
	unsaved?: boolean;
};

export type EditorState = {
	focused: boolean;
	tabs: EditorTab[];
	currentTab: string;
};

export type EDITOR_SCOPE = "editor";

export type OpenTabEvent = OrdoEvent<EDITOR_SCOPE, "open-tab", string>;
export type CloseTabEvent = OrdoEvent<EDITOR_SCOPE, "close-tab", string>;
export type FocusEvent = OrdoEvent<EDITOR_SCOPE, "focus">;
export type UnfocusEvent = OrdoEvent<EDITOR_SCOPE, "unfocus">;
export type HandleTypingEvent = OrdoEvent<
	EDITOR_SCOPE,
	"handle-typing",
	{ path: string; event: { key: string; ctrlKey: boolean; altKey: boolean; metaKey: boolean; shiftKey: boolean } }
>;
export type UpdateCaretPositionsEvent = OrdoEvent<
	EDITOR_SCOPE,
	"update-caret-positions",
	{ path: string; positions: CaretRange[] }
>;

export type EditorEvents = OpenTabEvent &
	CloseTabEvent &
	FocusEvent &
	UnfocusEvent &
	HandleTypingEvent &
	UpdateCaretPositionsEvent;
