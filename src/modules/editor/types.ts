import { OrdoEvent } from "@core/types/ordo-events";
import { OrdoFile } from "@modules/file-explorer/types";

export type EditorState = {
	tabs: OrdoFile[];
	currentTab: string;
};

export type EDITOR_SCOPE = "editor";

export type OpenTabEvent = OrdoEvent<EDITOR_SCOPE, "open-tab", string>;
export type CloseTabEvent = OrdoEvent<EDITOR_SCOPE, "close-tab", string>;

export type EditorEvents = OpenTabEvent & CloseTabEvent;
