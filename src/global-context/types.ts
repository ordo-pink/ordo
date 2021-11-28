import { FSTree } from "../utils/tree"
import { AstNode } from "../md-tools/types"

export type Nullable<T> = T | null

export type TagName = string
export type Path = string
export type ReadableName = string
export type FileExtension = string

export type FrontmatterKey = string
export type FrontmatterValue =
	| string
	| number
	| boolean
	| Date
	| Record<string, unknown>
	| FrontmatterValue[]

export type Frontmatter = Record<FrontmatterKey, FrontmatterValue>

export type WithBody<T extends ArbitraryFile> = T & { body: string }

export type WithFrontmatter<
	T extends ArbitraryFile | ArbitraryFolder,
	K extends Record<string, unknown>,
> = T & {
	frontmatter: K & Frontmatter
}

export type Tag = {
	name: TagName
	references: Path[]
}

export interface ArbitraryFile extends FSTree {
	path: Path
	readableName: ReadableName
	extension: FileExtension
	parent?: ArbitraryFolder
	isFile: true
	createdAt: Date
	updatedAt: Date
	accessedAt: Date
	size: number
	ast?: AstNode
}

export interface ArbitraryFolder extends FSTree {
	id: Path
	path: Path
	readableName: ReadableName
	children: Array<ArbitraryFolder | ArbitraryFile>
	parent?: ArbitraryFolder
	isFile: false
	tags?: any
	links?: any
}

export type MDFileFrontmatter = {
	icon: string
	heroImage: string
	hiddenProperties: FrontmatterKey[]
	tags: TagName[]
	isFavourite: boolean
	referencedBy: Path[]
	references: Path[]
	locked: boolean
}

export type MDFolderFrontmatter = {
	collapsed: boolean
	locked: boolean
}

export type MDFolder = WithFrontmatter<ArbitraryFolder, MDFolderFrontmatter>
export type MDFile = WithBody<WithFrontmatter<ArbitraryFile, MDFileFrontmatter>>

export type MDTree = MDFolder | MDFile

export type Editor = {
	tabs: Path[]
	pinnedTabs: Path[]
	currentTab: WithBody<ArbitraryFile>
}

export type GlobalContext = {
	tags: Tag[]
	editors: Editor[]
	explorer: MDTree[]
	favourites: Path[]
	recentFiles: Path[]
}
