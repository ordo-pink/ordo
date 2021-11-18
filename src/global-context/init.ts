import { Stats } from "fs"
import {
	ArbitraryFile,
	ArbitraryFolder,
	Editor,
	FileExtension,
	Frontmatter,
	MDFile,
	MDFileFrontmatter,
	MDFolder,
	MDFolderFrontmatter,
	Nullable,
	Path,
	ReadableName,
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

export function createArbitraryFile(path: Path, stats: Stats): Nullable<ArbitraryFile> {
	if (!stats.isFile()) {
		return null
	}

	const fileName = path.substring(path.lastIndexOf("/") + 1)
	const readableName = fileName.substring(0, fileName.lastIndexOf("."))
	const extension = fileName.substring(fileName.lastIndexOf("."))

	return {
		path,
		readableName,
		extension,
		isFile: true,
		createdAt: stats.birthtime,
		updatedAt: stats.mtime,
		accessedAt: stats.atime,
		size: stats.size,
	}
}

export function createMDFile(file: ArbitraryFile, frontmatter: MDFileFrontmatter): MDFile {
	return {
		...file,
		frontmatter,
	}
}

export function createArbitraryFolder(path: Path, stats: Stats): Nullable<ArbitraryFolder> {
	if (!stats.isDirectory()) {
		return null
	}

	const readableName = path.substring(path.lastIndexOf("/") + 1)

	return {
		path,
		readableName,
		isFile: false,
		children: [],
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
	return x && x.isFile
}

export function isFolder(x: any): x is ArbitraryFolder {
	return x && !x.isFile
}
