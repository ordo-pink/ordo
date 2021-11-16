import type { FileMetadata, Folder as TFolder } from "../../../main/apis/fs/types"

import React, { useEffect } from "react"

import { File } from "./file"
import { Folder } from "./folder"
import { Conditional } from "../conditional"
import { hasCurrentlyOpenedFile } from "../../../utils/tree"

export const FileExplorer: React.FC<{
	tree: TFolder
	root: string
	currentFile: string
	setCurrentFile: (page: string) => void
	unsavedFiles: string[]
	depth?: number
	createFile: (path: string) => Promise<void>
	createFolder: (path: string) => Promise<void>
}> = ({
	tree,
	root,
	setCurrentFile,
	currentFile,
	unsavedFiles,
	createFile,
	createFolder,
	depth = 1,
}) => {
	const [collapsed, setCollapsed] = React.useState(true)

	useEffect(() => {
		if (hasCurrentlyOpenedFile(tree, currentFile)) {
			setCollapsed(false)
		}
	}, [currentFile])

	return (
		<div className="w-full">
			<Folder
				depth={depth}
				collapsed={collapsed}
				setCollapsed={setCollapsed}
				folder={tree}
				createFile={createFile}
				createFolder={createFolder}
			/>

			<div className={`${collapsed ? "hidden" : "block"} w-full`}>
				{tree.children &&
					tree.children.map((fileOrFileTree) => (
						<Conditional key={fileOrFileTree.path} when={!(fileOrFileTree as TFolder).children}>
							<File
								unsavedFiles={unsavedFiles}
								file={fileOrFileTree as FileMetadata}
								currentFile={currentFile}
								depth={depth}
								setCurrentFile={setCurrentFile}
							/>
							<FileExplorer
								createFile={createFile}
								createFolder={createFolder}
								tree={fileOrFileTree as TFolder}
								unsavedFiles={unsavedFiles}
								root={root}
								setCurrentFile={setCurrentFile}
								currentFile={currentFile}
								depth={depth + 1}
							/>
						</Conditional>
					))}
			</div>
		</div>
	)
}
