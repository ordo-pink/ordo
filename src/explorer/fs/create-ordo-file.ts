import { FileAssociation } from "../../configuration/types";
import { getSettings } from "../../configuration/settings";
import { OrdoFile } from "../types";

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
	relativePath?: string;
}

export const createOrdoFile = ({
	depth = 0,
	createdAt = new Date(),
	updatedAt = new Date(),
	accessedAt = new Date(),
	path,
	relativePath,
	size,
}: CreateOrdoFileArg): OrdoFile => {
	const readableName = path.substring(path.lastIndexOf("/") + 1);
	const extension = readableName.substring(readableName.lastIndexOf(".")) ?? ".md";
	const associations = getSettings().get("file-explorer.file-associations");
	const association = associations.find((assoc) => assoc.extension === extension);

	let type: FileAssociation = "text";

	if (association) {
		type = association.association;
	}

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
