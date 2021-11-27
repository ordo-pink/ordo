import type { ArbitraryFolder, MDFile } from "../../../global-context/types"

import React, { useEffect } from "react"

import { File } from "./file"
import { Folder } from "./folder"
import { Conditional } from "../conditional"
import { hasCurrentlyOpenedFile } from "../../../utils/tree"
import { useAppSelector } from "../../../renderer/app/hooks"

export const FileExplorer: React.FC<{
	nestedTree?: ArbitraryFolder
	root: string
	currentFile: string
	setCurrentFile: (page: string) => void
	unsavedFiles: string[]
	depth?: number
	createFile: (folder: ArbitraryFolder, name: string) => Promise<void>
	createFolder: (folder: ArbitraryFolder, name: string) => Promise<void>
	deleteItem: (path: string) => Promise<void>
	rename: (oldPath: string, newPath: string) => Promise<void>
}> = ({
	nestedTree,
	root,
	setCurrentFile,
	currentFile,
	unsavedFiles,
	createFile,
	deleteItem,
	createFolder,
	rename,
	depth = 1,
}) => {
	const currentTree = nestedTree ? nestedTree : useAppSelector((state) => state.fileTree.tree)
	const [collapsed, setCollapsed] = React.useState(true)

	useEffect(() => {
		if (currentFile && hasCurrentlyOpenedFile(currentTree, currentFile)) {
			setCollapsed(false)
		}
	}, [currentFile, currentTree])

	return (
		currentTree && (
			<div className="w-full">
				<Folder
					depth={depth}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					folder={currentTree}
					createFile={createFile}
					createFolder={createFolder}
					rename={rename}
					deleteItem={deleteItem}
				/>

				<div className={`${collapsed ? "hidden" : "block"} w-full`}>
					{currentTree &&
						currentTree.children &&
						currentTree.children.map((fileOrFileTree) => (
							<Conditional
								key={fileOrFileTree.path}
								when={!(fileOrFileTree as ArbitraryFolder).children}
							>
								<File
									unsavedFiles={unsavedFiles}
									file={fileOrFileTree as MDFile}
									currentFile={currentFile}
									depth={depth}
									deleteItem={deleteItem}
									rename={rename}
									setCurrentFile={setCurrentFile}
								/>
								<FileExplorer
									createFile={createFile}
									createFolder={createFolder}
									rename={rename}
									deleteItem={deleteItem}
									nestedTree={fileOrFileTree as ArbitraryFolder}
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
