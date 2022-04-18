import { Command } from "@containers/commander/types";
import { OrdoEvent } from "@core/types";
import { Color } from "@core/appearance/colors/types";

export type APPLICATION_SCOPE = "application";

export type GetStateEvent = OrdoEvent<APPLICATION_SCOPE, "get-state">;
export type CloseWindowEvent = OrdoEvent<APPLICATION_SCOPE, "close-window">;
export type ToggleDevToolsEvent = OrdoEvent<APPLICATION_SCOPE, "toggle-dev-tools">;
export type ReloadWindowEvent = OrdoEvent<APPLICATION_SCOPE, "reload-window">;
export type RegisterCommandEvent = OrdoEvent<APPLICATION_SCOPE, "register-command", Command>;
export type SetFocusedComponent = OrdoEvent<APPLICATION_SCOPE, "set-focused-component", string>;
export type RevealInFinderEvent = OrdoEvent<APPLICATION_SCOPE, "reveal-in-finder", string | void>;
export type ShowFileCreationEvent = OrdoEvent<APPLICATION_SCOPE, "show-file-creation", string | void>;
export type ShowFolderCreationEvent = OrdoEvent<APPLICATION_SCOPE, "show-folder-creation", string | void>;
export type HideCreationEvent = OrdoEvent<APPLICATION_SCOPE, "hide-creation">;
export type CreateFileEvent = OrdoEvent<APPLICATION_SCOPE, "create-file", string>;
export type CreateFolderEvent = OrdoEvent<APPLICATION_SCOPE, "create-folder", string>;
export type SavePropsEvent = OrdoEvent<APPLICATION_SCOPE, "save-props", any[]>;
export type ShowContextMenuEvent = OrdoEvent<
	APPLICATION_SCOPE,
	"show-context-menu",
	{ x: number; y: number; item: string; params: Record<string, any> }
>;

export type OpenFolderEvent = OrdoEvent<APPLICATION_SCOPE, "open-folder", string | void>;
export type CopyPathEvent = OrdoEvent<APPLICATION_SCOPE, "copy-path", string | void>;
export type CopyRelativePathEvent = OrdoEvent<APPLICATION_SCOPE, "copy-relative-path", string | void>;
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
	SavePropsEvent &
	SetFocusedComponent &
	ShowContextMenuEvent &
	RevealInFinderEvent &
	DeleteEvent &
	CopyPathEvent &
	CopyRelativePathEvent &
	ShowFileCreationEvent &
	ShowFolderCreationEvent &
	HideCreationEvent &
	CreateFileEvent &
	CreateFolderEvent &
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
	createFileIn?: string;
	createFolderIn?: string;
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
	frontmatter?: Record<string, unknown>;
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
