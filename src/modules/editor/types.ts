import { OrdoEvent } from "@core/types";
import { OrdoFile } from "@modules/file-explorer/types";

export type Tab = Required<Pick<OrdoFile, "path" | "raw">>;

export type EditorState = {
	tabs: Tab[];
	currentTab: string;
};

export type EDITOR_SCOPE = "editor";

export type OpenTabEvent = OrdoEvent<EDITOR_SCOPE, "open-tab", string>;
export type CloseTabEvent = OrdoEvent<EDITOR_SCOPE, "close-tab", string>;

export type EditorEvents = OpenTabEvent & CloseTabEvent;
