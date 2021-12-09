import { OrdoFile } from "../types";

import { promises } from "fs";

function toReadableSize(a: number, b = 2, k = 1024): string {
	const d = Math.floor(Math.log(a) / Math.log(k));
	return 0 == a
		? "0 Bytes"
		: `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))}${
				["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
		  }`;
}

const IMAGE_FILE_EXTENSIONS = [
	".apng",
	".avif",
	".gif",
	".jpg",
	".jpeg",
	".pjpeg",
	".pjp",
	".png",
	".svg",
	".webp",
	".bmp",
	".ico",
	".cur",
	".tif",
	".tiff",
];
const DOCUMENT_FILE_EXTENSIONS = [".md", ".txt"]; // TODO

interface CreateOrdoFileArg {
	path: string;
	size?: number;
	depth?: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	readablePath?: string;
}

export const createOrdoFile = ({
	depth = 0,
	createdAt = new Date(),
	updatedAt = new Date(),
	accessedAt = new Date(),
	path,
	readablePath,
	size,
}: CreateOrdoFileArg): OrdoFile => {
	const readableName = path.substring(path.lastIndexOf("/") + 1);
	const extension = readableName.substring(readableName.lastIndexOf(".")) ?? ".md";
	const readableSize = toReadableSize(size);
	const type = IMAGE_FILE_EXTENSIONS.includes(extension)
		? "image"
		: DOCUMENT_FILE_EXTENSIONS.includes(extension)
		? "document"
		: "other";

	return {
		depth,
		createdAt,
		updatedAt,
		accessedAt,
		path,
		size,
		readableName,
		readablePath,
		extension,
		readableSize,
		type,
	};
};

export async function createFile(path: string, rootPath: string): Promise<OrdoFile> {
	const readablePath = path.replace(rootPath, "");

	try {
		await promises.writeFile(path, "");

		const { mtime, atime, birthtime, size } = await promises.stat(path);

		return createOrdoFile({
			path,
			size,
			readablePath,
			createdAt: birthtime,
			updatedAt: mtime,
			accessedAt: atime,
		});
	} catch (e) {
		return e;
	}
}
