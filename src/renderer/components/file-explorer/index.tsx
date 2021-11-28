import type { ArbitraryFolder, MDFile } from "../../../global-context/types"

import React, { useEffect } from "react"

import { File } from "./file"
import { Folder } from "./folder"
import { Conditional } from "../conditional"
import { hasCurrentlyOpenedFile } from "../../../utils/tree"
import { useAppSelector } from "../../../renderer/app/hooks"

export const FileExplorer: React.FC<{
	root: string
	unsavedFiles: string[]
	nestedTree?: ArbitraryFolder
	depth?: number
}> = ({ nestedTree, root, unsavedFiles, depth = 1 }) => {
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
				/>

				<div className={`${collapsed ? "hidden" : "block"} w-full`}>
					{currentTree &&
						currentTree.children &&
						currentTree.children.map((fileOrFileTree) => (
							<Conditional key={fileOrFileTree.path} when={fileOrFileTree.isFile}>
								<File unsavedFiles={unsavedFiles} file={fileOrFileTree as MDFile} depth={depth} />

								<FileExplorer
									nestedTree={fileOrFileTree as ArbitraryFolder}
									unsavedFiles={unsavedFiles}
									root={root}
									depth={depth + 1}
								/>
							</Conditional>
						))}
				</div>
			</div>
		)
	)
}
