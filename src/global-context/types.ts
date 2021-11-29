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

export type WithBody<T extends OrdoFile> = T & { body: string }

export type WithFrontmatter<
	T extends OrdoFile | OrdoFolder,
	K extends Record<string, unknown>,
> = T & {
	frontmatter: K & Frontmatter
}

export interface OrdoFile {
	path: Path
	isFile: true
	exists: boolean
	depth: number
	readableName: ReadableName
	extension: FileExtension
	parent?: Path
	createdAt: Date
	updatedAt: Date
	accessedAt: Date
	size: number
	readableSize: string
}

export interface Tag {
	name: TagName
	children: OrdoFile[]
}

export interface Link {
	source: Path
	target: Path
	exists: boolean
}

export interface OrdoFolder {
	path: Path
	isFile: false
	exists: boolean
	depth: number
	collapsed: boolean
	readableName: ReadableName
	createdAt: Date
	updatedAt: Date
	accessedAt: Date
	parent?: Path
	children: Array<OrdoFolder | OrdoFile>
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

export type MDFolder = WithFrontmatter<OrdoFolder, MDFolderFrontmatter>
export type MDFile = WithBody<WithFrontmatter<OrdoFile, MDFileFrontmatter>>

export type MDTree = MDFolder | MDFile

export type Editor = {
	tabs: Path[]
	pinnedTabs: Path[]
	currentTab: WithBody<OrdoFile>
}

export type GlobalContext = {
	tags: Tag[]
	editors: Editor[]
	explorer: MDTree[]
	favourites: Path[]
	recentFiles: Path[]
}
