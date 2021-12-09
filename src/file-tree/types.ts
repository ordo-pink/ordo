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

export type ConnectionType = "fs" | "link" | "tag" | "relation";

export interface Connection {
	source: OrdoEntity;
	target: OrdoEntity;
	exists: boolean;
	type: ConnectionType;
}

export interface Exists {
	exists: true;
}

export interface OrdoEntity {
	exists: boolean;
	type: OrdoFileType | "folder";
	path: string;
	readableName: string;
	readablePath: string;
	depth: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
}

export interface AbstractOrdoFile extends OrdoEntity {
	type: OrdoFileType;
	extension: string;
}

export interface AbstractOrdoFolder extends OrdoEntity {
	type: "folder";
	children: Array<AbstractOrdoFolder | AbstractOrdoFile>;
}

export interface VirtualOrdoFile extends AbstractOrdoFile {
	exists: false;
}

export interface VirtualOrdoFolder extends AbstractOrdoFolder {
	exists: false;
}

export interface OrdoFile extends AbstractOrdoFile {
	exists: true;
	size: number;
	readableSize: string;
}

export interface OrdoFileWithBody extends OrdoFile {
	body: string;
}

export interface OrdoFolder extends AbstractOrdoFolder {
	exists: true;
	collapsed: boolean;
	color: Color;
}
