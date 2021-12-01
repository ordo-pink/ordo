import { promises } from "fs"
import { createOrdoFile } from "../../../global-context/init"
import { Path, OrdoFile, WithBody } from "../../../global-context/types"

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
]

export async function getFileContent(path: Path): Promise<WithBody<OrdoFile>> {
	const { mtime, atime, birthtime, size } = await promises.stat(path)
	const ordoFile = createOrdoFile({ path, mtime, atime, birthtime, size, exists: true })

	const encoding = IMAGE_FILE_EXTENSIONS.includes(ordoFile.extension) ? "base64" : "utf-8"

	const body = await promises.readFile(path, encoding)

	return {
		...ordoFile,
		body,
	}
}
