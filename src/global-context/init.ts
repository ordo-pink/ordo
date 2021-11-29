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

export function createArbitraryFile(
	path: Path,
	stats: Stats,
	parent?: ArbitraryFolder,
): Nullable<ArbitraryFile> {
	if (!stats.isFile()) {
		return null
	}

	const fileName = path.substring(path.lastIndexOf("/") + 1)
	const readableName = fileName.substring(0, fileName.lastIndexOf("."))
	const extension = fileName.substring(fileName.lastIndexOf("."))

	return {
		id: path,
		path,
		readableName,
		extension,
		isFile: true,
		createdAt: stats.birthtime,
		updatedAt: stats.mtime,
		accessedAt: stats.atime,
		size: stats.size,
		parent,
		children: [],
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

export function isFile(x: Record<string, unknown>): x is ArbitraryFile {
	return x && Boolean(x.isFile)
}

export function isFolder(x: Record<string, unknown>): x is ArbitraryFolder {
	return x && !x.isFile
}
