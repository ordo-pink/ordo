import { Color } from "../appearance/get-color"

export type FrontmatterField = string | number | boolean | Date | FrontmatterField[]

export type SortOrder = {
	property: string
	direction: "ASC" | "DESC"
}

export type FileOrder = string[]

export type FolderOrder = string[]

export type Folder = {
	path: FolderPath
	readableName: string
	children: Array<Folder | FileMetadata>
	isFolder: true
	isFile: false
	color: Color
	collapsed: boolean
	sort: SortOrder
	fileOrder: FileOrder
	folderOrder: FolderOrder
}

export type FolderPath = string
export type FilePath = string

export type ResponseHash = string

export type FileMetadata = {
	readableName: string
	createdAt: Date // birthtime
	updatedAt: Date // mtime
	accessedAt: Date // atime
	path: FilePath
	size: number
	frontmatter: Record<string, FrontmatterField>
	isFolder: false
	isFile: true
}

export type IFile = FileMetadata & {
	body: string
}
