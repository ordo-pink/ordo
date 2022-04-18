import { store } from "@core/config-store";
import { OrdoFile } from "@modules/editor/editor-slice";

const toReadableSize = (a: number, b = 2, k = 1024): string => {
	const d = Math.floor(Math.log(a) / Math.log(k));
	return 0 == a
		? "0 Bytes"
		: `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))}${
				["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
		  }`;
};

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

	const associations = store.store.explorer.associations;
	const association = associations.find((a) => a.extension === extension);

	const type = association ? association.association : "file";
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
		type: type as any,
		ranges: [
			{
				start: {
					line: 1,
					character: 0,
				},
				end: {
					line: 1,
					character: 0,
				},
				direction: "ltr",
			},
		],
	};
};
