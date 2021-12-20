import { FileAssociation } from "../configuration/types";
import colors from "tailwindcss/colors";

export type OrdoEntity = OrdoFile | OrdoFolder;

export type OrdoFile = {
	path: string;
	readableName: string;
	relativePath: string;
	depth: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	type: FileAssociation;
	extension: string;
	size: number;
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
	color: keyof typeof colors;
};
