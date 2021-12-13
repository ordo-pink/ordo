import { Color } from "../common/color";
import { FileTreeAPI } from "./api";

export interface IFileTreeAPI {
	[FileTreeAPI.SELECT_ROOT_FOLDER]: () => Promise<OrdoFolder>;
	[FileTreeAPI.CREATE_FOLDER]: (path: string) => Promise<OrdoFolder>;
	[FileTreeAPI.GET_FOLDER]: (path: string) => Promise<OrdoFolder>;
	[FileTreeAPI.UPDATE_FOLDER]: (path: string, inc: Partial<OrdoFolder>) => Promise<OrdoFolder>;
	[FileTreeAPI.MOVE_FOLDER]: (oldPath: string, newPath: string) => Promise<OrdoFolder>;
	[FileTreeAPI.DELETE_FOLDER]: (path: string) => Promise<OrdoFolder>;
	[FileTreeAPI.CREATE_FILE]: (path: string) => Promise<OrdoFolder>;
	[FileTreeAPI.GET_FILE]: (path: string) => Promise<OrdoFileWithBody>;
	[FileTreeAPI.UPDATE_FILE]: (path: string, inc: Partial<OrdoFile>) => Promise<OrdoFolder>;
	[FileTreeAPI.MOVE_FILE]: (oldPath: string, newPath: string) => Promise<OrdoFolder>;
	[FileTreeAPI.DELETE_FILE]: (path: string) => Promise<OrdoFolder>;
	[FileTreeAPI.SAVE_FILE]: (path: string, data: string) => Promise<OrdoFolder>;
}

export type OrdoFileType = "image" | "document" | "other";

export type OrdoEntity = OrdoFile | OrdoFolder;

export interface OrdoFile {
	path: string;
	readableName: string;
	readablePath: string;
	depth: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	type: OrdoFileType;
	extension: string;
	size: number;
	readableSize: string;
}

export interface OrdoFileWithBody extends OrdoFile {
	body: string;
}

export interface OrdoFolder {
	path: string;
	readableName: string;
	readablePath: string;
	depth: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	type: "folder";
	children: OrdoEntity[];
	collapsed: boolean;
	color: Color;
}
