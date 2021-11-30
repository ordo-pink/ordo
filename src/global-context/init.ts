import {
	OrdoFile,
	OrdoFolder,
	Editor,
	Frontmatter,
	MDFile,
	MDFileFrontmatter,
	MDFolder,
	MDFolderFrontmatter,
	Path,
	WithBody,
} from "./types"

export function createEditor(
	tabs: Path[] = [],
	currentTab: WithBody<MDFile> = null,
	pinnedTabs: Path[] = [],
): Editor {
	return {
		tabs,
		currentTab,
		pinnedTabs,
	}
}

const defaultMDFileFrontmatter: MDFileFrontmatter = {
	referencedBy: [],
	references: [],
	isFavourite: false,
	heroImage: "",
	hiddenProperties: [],
	icon: "",
	locked: false,
	tags: [],
}

export function createMDFileFrontmatter(frontmatter: Frontmatter = {}): MDFileFrontmatter {
	return {
		...defaultMDFileFrontmatter,
		...frontmatter,
	}
}

const defaultMDFolderFrontmatter: MDFolderFrontmatter = {
	collapsed: false,
	locked: false,
}

export function createMDFolderFrontmatter(frontmatter: Frontmatter = {}): MDFolderFrontmatter {
	return {
		...defaultMDFolderFrontmatter,
		...frontmatter,
	}
}

type CreateOrdoFileArg = {
	path: Path
	birthtime?: Date
	mtime?: Date
	atime?: Date
	exists: boolean
	depth?: number
	size?: number
	parent?: Path
}

const toReadableSize = (a: number, b = 2, k = 1024): string => {
	const d = Math.floor(Math.log(a) / Math.log(k))
	return 0 == a
		? "0 Bytes"
		: `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))}${
				["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
		  }`
}

export const ICON: Record<string, string> = {
	".md": "📄",
	".png": "🌄",
	".jpg": "🏞",
	".jpeg": "🏞",
}

export function createOrdoFile({
	path,
	birthtime = new Date(),
	atime = new Date(),
	mtime = new Date(),
	depth = null,
	parent = null,
	exists,
	size = 0,
}: CreateOrdoFileArg): OrdoFile {
	const readableName = path.substring(path.lastIndexOf("/") + 1)
	const extension = readableName.substring(readableName.lastIndexOf("."))
	const createdAt = birthtime ?? new Date()
	const updatedAt = mtime ?? new Date()
	const accessedAt = atime ?? new Date()
	const readableSize = toReadableSize(size)

	return {
		isFile: true,
		path,
		exists,
		icon: ICON[extension] ?? "🛠",
		readableName,
		extension,
		depth,
		createdAt,
		updatedAt,
		accessedAt,
		size,
		parent,
		readableSize,
	}
}

export function createMDFile(file: OrdoFile, frontmatter: MDFileFrontmatter, body: string): MDFile {
	return {
		...file,
		frontmatter,
		body,
	}
}

type CreateOrdoFolderArg = {
	path: Path
	birthtime?: Date
	collapsed?: boolean
	exists: boolean
	mtime?: Date
	atime?: Date
	depth?: number
	parent?: Path
	children?: Array<OrdoFile | OrdoFolder>
}
export function createOrdoFolder({
	path,
	birthtime,
	mtime,
	exists,
	atime,
	collapsed = false,
	depth = null,
	parent = null,
	children = [],
}: CreateOrdoFolderArg): OrdoFolder {
	const splittablePath = path.endsWith("/") ? path.slice(0, -1) : path
	const readableName = splittablePath.substring(path.lastIndexOf("/") + 1)
	const createdAt = birthtime ?? new Date()
	const updatedAt = mtime ?? new Date()
	const accessedAt = atime ?? new Date()

	return {
		path,
		readableName,
		isFile: false,
		exists,
		depth,
		parent,
		collapsed,
		children,
		createdAt,
		updatedAt,
		accessedAt,
	}
}

export function createMDFolder(folder: OrdoFolder, frontmatter: MDFolderFrontmatter): MDFolder {
	return {
		...folder,
		frontmatter,
	}
}

export function isFile(x: any): x is OrdoFile {
	return x && Boolean(x.isFile)
}

export function isFolder(x: any): x is OrdoFolder {
	return x && !x.isFile
}
