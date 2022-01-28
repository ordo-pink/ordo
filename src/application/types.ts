import { Command } from "../containers/commander/types";
import { OrdoEvent } from "../common/types";
import { Color } from "./appearance/colors/types";

export type APPLICATION_SCOPE = "application";

export type GetStateEvent = OrdoEvent<APPLICATION_SCOPE, "get-state">;
export type CloseWindowEvent = OrdoEvent<APPLICATION_SCOPE, "close-window">;
export type ToggleDevToolsEvent = OrdoEvent<APPLICATION_SCOPE, "toggle-dev-tools">;
export type ReloadWindowEvent = OrdoEvent<APPLICATION_SCOPE, "reload-window">;
export type RegisterCommandEvent = OrdoEvent<APPLICATION_SCOPE, "register-command", Command>;
export type SetFocusedComponent = OrdoEvent<APPLICATION_SCOPE, "set-focused-component", string>;
export type RevealInFinderEvent = OrdoEvent<APPLICATION_SCOPE, "reveal-in-finder", string | void>;
export type ShowContextMenuEvent = OrdoEvent<
	APPLICATION_SCOPE,
	"show-context-menu",
	{ x: number; y: number; item: string; params: Record<string, any> }
>;

export type OpenFolderEvent = OrdoEvent<APPLICATION_SCOPE, "open-folder", string | void>;
export type UpdateFolderEvent = OrdoEvent<APPLICATION_SCOPE, "update-folder", [string, Partial<OrdoFolder>]>;
export type OpenFileEvent = OrdoEvent<APPLICATION_SCOPE, "open-file", string>;
export type SetCurrentFileEvent = OrdoEvent<APPLICATION_SCOPE, "set-current-file", number>;
export type CloseFileEvent = OrdoEvent<APPLICATION_SCOPE, "close-file", number | void>;
export type SaveFileEvent = OrdoEvent<APPLICATION_SCOPE, "save-file", string | void>;
export type DeleteEvent = OrdoEvent<APPLICATION_SCOPE, "delete", string | void>;

export type ApplicationEvent = GetStateEvent &
	CloseWindowEvent &
	ToggleDevToolsEvent &
	ReloadWindowEvent &
	RegisterCommandEvent &
	OpenFolderEvent &
	UpdateFolderEvent &
	OpenFileEvent &
	SetCurrentFileEvent &
	CloseFileEvent &
	SetFocusedComponent &
	ShowContextMenuEvent &
	RevealInFinderEvent &
	DeleteEvent &
	SaveFileEvent;

export type SelectionBoundary = {
	line: number;
	index: number;
};

export type Selection = {
	start: SelectionBoundary;
	end: SelectionBoundary;
	direction: "ltr" | "rtl";
};

export type OpenOrdoFile = OrdoFile & { body: string[][]; selection: Selection };

export type OpenOrdoFiles = OpenOrdoFile[];

export type ApplicationState = {
	commands: Command[];
	cwd: string;
	tree?: OrdoFolder;
	unsavedFiles: string[];
	focusedComponent: string;
	currentFile: number;
	currentFilePath: string;
	openFiles: OpenOrdoFiles;
	showDevTools: boolean;
};

export type OrdoEntity = OrdoFile | OrdoFolder;

export type OrdoFile = {
	path: string;
	readableName: string;
	relativePath: string;
	depth: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	extension: string;
	size: number;
	type: "text" | "image" | string;
	readableSize: string;
};

export type OrdoFolder = {
	collapsed: boolean;
	path: string;
	readableName: string;
	relativePath: string;
	depth: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	type: "folder";
	children: OrdoEntity[];
	color: Color;
};
