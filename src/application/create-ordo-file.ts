import { OrdoFile } from "./types"

const toReadableSize = (a = 0, b = 2, k = 1024): string => {
	if (a === 0) {
		return "0 Bytes"
	}

	const d = Math.floor(Math.log(a) / Math.log(k))

	return `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))}${
		["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
	}`
}

interface CreateOrdoFileArg {
	path: string
	size?: number
	depth?: number
	createdAt?: Date
	updatedAt?: Date
	accessedAt?: Date
	relativePath: string
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
	const type = "file"
	const readableName = path.substring(path.lastIndexOf("/") + 1)
	const extension = readableName.substring(readableName.lastIndexOf(".")) ?? ".md"

	const readableSize = toReadableSize(size)

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
	}
}
