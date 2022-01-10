import { OrdoFolder } from "../types";

type CreateOrdoFolderArg = {
	path: string;
	depth?: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	collapsed?: boolean;
	relativePath?: string;
};

export const createOrdoFolder = ({
	depth = 0,
	createdAt = new Date(),
	updatedAt = new Date(),
	accessedAt = new Date(),
	path,
	collapsed = true,
	relativePath,
}: CreateOrdoFolderArg): OrdoFolder => {
	const splittablePath = path.endsWith("/") ? path.slice(0, -1) : path;
	const readableName = splittablePath.slice(splittablePath.lastIndexOf("/") + 1);

	return {
		path,
		relativePath,
		readableName,
		depth,
		createdAt,
		updatedAt,
		accessedAt,
		collapsed,
		type: "folder",
		children: [],
		color: "gray",
	};
};
