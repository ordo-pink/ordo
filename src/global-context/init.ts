import { Stats } from "fs"
import {
	ArbitraryFile,
	ArbitraryFolder,
	Editor,
	Frontmatter,
	MDFile,
	MDFileFrontmatter,
	MDFolder,
	MDFolderFrontmatter,
	Nullable,
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

type CreateArbitraryFileArg = {
	path: Path
	birthtime?: Date
	mtime?: Date
	atime?: Date
	size?: number
	parent?: ArbitraryFolder
}

export function createArbitraryFile({
	path,
	birthtime,
	atime,
	mtime,
	parent,
	size = 0,
}: CreateArbitraryFileArg): ArbitraryFile {
	const readableName = path.substring(path.lastIndexOf("/") + 1)
	const extension = readableName.substring(readableName.lastIndexOf("."))

	const createdAt = birthtime ?? new Date()
	const updatedAt = mtime ?? new Date()
	const accessedAt = atime ?? new Date()

	return {
		isFile: true,
		path,
		readableName,
		extension,
		createdAt,
		updatedAt,
		accessedAt,
		size,
		parent,
	}
}

export function createMDFile(
	file: ArbitraryFile,
	frontmatter: MDFileFrontmatter,
	body: string,
): MDFile {
	return {
		...file,
		frontmatter,
		body,
	}
}

export function createArbitraryFolder(
	path: Path,
	stats: Stats,
	parent?: ArbitraryFolder,
): Nullable<ArbitraryFolder> {
	if (!stats.isDirectory()) {
		return null
	}

	if (path.endsWith("/")) {
		path = path.slice(0, -1)
	}

	const readableName = path.substring(path.lastIndexOf("/") + 1)

	return {
		path,
		readableName,
		isFile: false,
		children: [],
		tags: [],
		id: path,
		parent,
	}
}

export function createMDFolder(
	folder: ArbitraryFolder,
	frontmatter: MDFolderFrontmatter,
): MDFolder {
	return {
		...folder,
		frontmatter,
	}
}

export function isFile(x: any): x is ArbitraryFile {
	return x && Boolean(x.isFile)
}

export function isFolder(x: any): x is ArbitraryFolder {
	return x && !x.isFile
}
