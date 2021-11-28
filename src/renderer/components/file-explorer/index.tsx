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
	setCurrentFile: (page: string) => void
	unsavedFiles: string[]
	depth?: number
	rename: (oldPath: string, newPath: string) => Promise<void>
}> = ({ nestedTree, root, setCurrentFile, unsavedFiles, rename, depth = 1 }) => {
	const currentPath = useAppSelector((state) => state.fileTree.currentPath)
	const currentTree = nestedTree ? nestedTree : useAppSelector((state) => state.fileTree.tree)
	const [collapsed, setCollapsed] = React.useState(true)

	useEffect(() => {
		if (currentPath && hasCurrentlyOpenedFile(currentTree, currentPath)) {
			setCollapsed(false)
		}
	}, [currentPath, currentTree])

	return (
		currentTree && (
			<div className="w-full">
				<Folder
					depth={depth}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					folder={currentTree}
					rename={rename}
				/>

				<div className={`${collapsed ? "hidden" : "block"} w-full`}>
					{currentTree &&
						currentTree.children &&
						currentTree.children.map((fileOrFileTree) => (
							<Conditional key={fileOrFileTree.path} when={fileOrFileTree.isFile}>
								<File
									unsavedFiles={unsavedFiles}
									file={fileOrFileTree as MDFile}
									depth={depth}
									rename={rename}
									setCurrentFile={setCurrentFile}
								/>

								<FileExplorer
									rename={rename}
									nestedTree={fileOrFileTree as ArbitraryFolder}
									unsavedFiles={unsavedFiles}
									root={root}
									setCurrentFile={setCurrentFile}
									depth={depth + 1}
								/>
							</Conditional>
						))}
				</div>
			</div>
		)
	)
}
