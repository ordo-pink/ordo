import { Selection } from "@modules/application/types";
import { OrdoEvent } from "@core/types";

export type EDITOR_SCOPE = "editor";

export type OnKeyDownEvent = OrdoEvent<EDITOR_SCOPE, "on-key-down", KeysDown>;
export type OnMouseUpEvent = OrdoEvent<EDITOR_SCOPE, "on-mouse-up", Selection>;
export type SelectAllEvent = OrdoEvent<EDITOR_SCOPE, "select-all">;

export type EditorEvent = OnKeyDownEvent & OnMouseUpEvent & SelectAllEvent;

export type KeysDown = {
	key: string;
	metaKey: boolean;
	altKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
};
