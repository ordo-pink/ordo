import type { OrdoFolder } from "../types";

import { promises } from "fs";
import { Color } from "../../common/color";

interface CreateOrdoFolderArg {
	path: string;
	depth?: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	collapsed?: boolean;
	readablePath?: string;
}

export const createOrdoFolder = ({
	depth = 0,
	createdAt = new Date(),
	updatedAt = new Date(),
	accessedAt = new Date(),
	path,
	collapsed = true,
	readablePath,
}: CreateOrdoFolderArg): OrdoFolder => {
	const splittablePath = path.endsWith("/") ? path.slice(0, -1) : path;
	const readableName = splittablePath.slice(splittablePath.lastIndexOf("/") + 1);

	return {
		path,
		readablePath,
		readableName,
		depth,
		createdAt,
		updatedAt,
		accessedAt,
		collapsed,
		type: "folder",
		children: [],
		color: Color.GRAY,
	};
};

export async function createFolder(path: string, rootPath: string): Promise<OrdoFolder> {
	const readablePath = path.replace(rootPath, "");

	try {
		await promises.mkdir(path, { recursive: true });

		const { mtime, atime, birthtime } = await promises.stat(path);

		return createOrdoFolder({
			path,
			readablePath,
			createdAt: birthtime,
			updatedAt: mtime,
			accessedAt: atime,
		});
	} catch (e) {
		return e;
	}
}
