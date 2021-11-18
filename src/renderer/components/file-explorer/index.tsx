import type { ArbitraryFolder, MDFile } from "../../../global-context/types"

import React, { useEffect } from "react"

import { File } from "./file"
import { Folder } from "./folder"
import { Conditional } from "../conditional"
import { hasCurrentlyOpenedFile } from "../../../utils/tree"

export const FileExplorer: React.FC<{
	tree: ArbitraryFolder
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
	tree,
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
					deleteItem={deleteItem}
				/>

				<div className={`${collapsed ? "hidden" : "block"} w-full`}>
					{tree &&
						tree.children &&
						tree.children.map((fileOrFileTree) => (
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
									tree={fileOrFileTree as ArbitraryFolder}
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
