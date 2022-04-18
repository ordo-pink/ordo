import { OrdoFile } from "@modules/application/types";

const toReadableSize = (a = 0, b = 2, k = 1024): string => {
	if (a === 0) {
		return "0 Bytes";
	}

	const d = Math.floor(Math.log(a) / Math.log(k));

	return `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))}${
		["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
	}`;
};

const fileAssociations = [
	{ extension: ".apng", association: "image" },
	{ extension: ".avif", association: "image" },
	{ extension: ".gif", association: "image" },
	{ extension: ".jpg", association: "image" },
	{ extension: ".jpeg", association: "image" },
	{ extension: ".pjpeg", association: "image" },
	{ extension: ".pjp", association: "image" },
	{ extension: ".png", association: "image" },
	{ extension: ".svg", association: "image" },
	{ extension: ".webp", association: "image" },
	{ extension: ".bmp", association: "image" },
	{ extension: ".ico", association: "image" },
	{ extension: ".cur", association: "image" },
	{ extension: ".tif", association: "image" },
	{ extension: ".tiff", association: "image" },
	{ extension: ".md", association: "text" },
	{ extension: ".txt", association: "text" },
];

interface CreateOrdoFileArg {
	path: string;
	size?: number;
	depth?: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	relativePath: string;
}

export const createOrdoFile = ({
	depth = 0,
	createdAt = new Date(),
	updatedAt = new Date(),
	accessedAt = new Date(),
	path,
	relativePath,
	size = 0,
}: CreateOrdoFileArg): OrdoFile => {
	const readableName = path.substring(path.lastIndexOf("/") + 1);
	const extension = readableName.substring(readableName.lastIndexOf(".")) ?? ".md";

	const type = fileAssociations.find((assoc) => assoc.extension === extension)?.association || "other";

	const readableSize = toReadableSize(size);

	return {
		depth,
		createdAt,
		updatedAt,
		accessedAt,
		path,
		size,
		readableName,
		relativePath,
		extension,
		readableSize,
		type,
	};
};
