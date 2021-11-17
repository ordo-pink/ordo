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
	deleteFile: (path: string) => Promise<void>
	createFolder: (path: string) => Promise<void>
	deleteFolder: (path: string) => Promise<void>
	rename: (oldPath: string, newPath: string) => Promise<void>
}> = ({
	tree,
	root,
	setCurrentFile,
	currentFile,
	unsavedFiles,
	createFile,
	deleteFile,
	createFolder,
	deleteFolder,
	rename,
	depth = 1,
}) => {
	const [collapsed, setCollapsed] = React.useState(true)

	useEffect(() => {
		if (currentFile && hasCurrentlyOpenedFile(tree, currentFile)) {
			setCollapsed(false)
		}
	}, [currentFile])

	return (
		tree && (
			<div className="w-full">
				<Folder
					depth={depth}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					folder={tree}
					createFile={createFile}
					createFolder={createFolder}
					rename={rename}
					deleteFolder={deleteFolder}
				/>

				<div className={`${collapsed ? "hidden" : "block"} w-full`}>
					{tree &&
						tree.children &&
						tree.children.map((fileOrFileTree) => (
							<Conditional key={fileOrFileTree.path} when={!(fileOrFileTree as TFolder).children}>
								<File
									unsavedFiles={unsavedFiles}
									file={fileOrFileTree as FileMetadata}
									currentFile={currentFile}
									depth={depth}
									deleteFile={deleteFile}
									rename={rename}
									setCurrentFile={setCurrentFile}
								/>
								<FileExplorer
									createFile={createFile}
									createFolder={createFolder}
									rename={rename}
									deleteFile={deleteFile}
									deleteFolder={deleteFolder}
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
	)
}
