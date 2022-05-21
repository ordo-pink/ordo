import { Color } from "@core/appearance/colors";
import { OrdoEvent } from "@core/types";

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
	readableSize: string;
	raw?: string;
	type: "image" | "document" | "file";
};

export type OrdoFolder = {
	collapsed: boolean;
	path: string;
	readableName: string;
	relativePath: string;
	depth: number;
	createdAt: Date;
	updatedAt: Date;
	accessedAt: Date;
	children: Array<OrdoFolder | OrdoFile>;
	color: Color;
	type: "folder";
};

export type FileExplorerState = {
	tree: OrdoFolder;
	createFileIn: string;
	createFolderIn: string;
};

export type FILE_EXPLORER_SCOPE = "file-explorer";

export type CreateFileEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "create-file", string>;
export type CreateFolderEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "create-folder", string>;
export type FindOrdoFileEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "find-file", { [K in keyof OrdoFile]: OrdoFile[K] }>;
export type FindOrdoFolderEvent = OrdoEvent<
	FILE_EXPLORER_SCOPE,
	"find-folder",
	{ [K in keyof OrdoFolder]: OrdoFolder[K] }
>;
export type UpdateOrdoFileEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "update-file", { path: string } & Partial<OrdoFile>>;
export type UpdateOrdoFolderEvent = OrdoEvent<
	FILE_EXPLORER_SCOPE,
	"update-folder",
	{ path: string } & Partial<OrdoFolder>
>;
export type RemoveOrdoFileEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "remove-file", string>;
export type RemoveOrdoFolderEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "remove-folder", string>;
export type ListOrdoFolderEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "list-folder", string>;
export type MoveFileOrFolderEvent = OrdoEvent<
	FILE_EXPLORER_SCOPE,
	"move",
	{ oldPath: string; newFolder: string; name: string }
>;

export type ToggleFolderEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "toggle-folder", string>;
export type SetFolderColorEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "set-folder-color", { path: string; color: Color }>;
export type RevealInFinderEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "reveal-in-finder", string | undefined>;
export type CopyPathEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "copy-path", string | undefined>;
export type FoldFolderEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "fold-folder", string>;
export type UnfoldFolderEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "unfold-folder", string>;
export type ShowFileCreationEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "show-file-creation", string>;
export type ShowFolderCreationEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "show-folder-creation", string>;
export type HideCreationEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "hide-creation">;

export type ShowFileContextMenu = OrdoEvent<
	FILE_EXPLORER_SCOPE,
	"show-file-context-menu",
	{ path: string; x: number; y: number }
>;
export type ShowFolderContextMenuEvent = OrdoEvent<
	FILE_EXPLORER_SCOPE,
	"show-folder-context-menu",
	{ path: string; x: number; y: number }
>;

export type SaveFileEvent = OrdoEvent<FILE_EXPLORER_SCOPE, "save-file", { path: string; content: string } | null>;

export type FileExplorerEvents = CreateFileEvent &
	CreateFolderEvent &
	FindOrdoFileEvent &
	FindOrdoFolderEvent &
	UpdateOrdoFileEvent &
	UpdateOrdoFolderEvent &
	RemoveOrdoFileEvent &
	RemoveOrdoFolderEvent &
	ListOrdoFolderEvent &
	MoveFileOrFolderEvent &
	ShowFileCreationEvent &
	ShowFolderCreationEvent &
	HideCreationEvent &
	ToggleFolderEvent &
	FoldFolderEvent &
	UnfoldFolderEvent &
	ShowFileContextMenu &
	SetFolderColorEvent &
	RevealInFinderEvent &
	CopyPathEvent &
	SaveFileEvent &
	ShowFolderContextMenuEvent;
