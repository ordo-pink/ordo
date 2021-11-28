import type { MDFile } from "../../../global-context/types"

import React from "react"

import { Conditional } from "../conditional"
import { Emoji } from "../emoji"
import { useAppDispatch, useAppSelector } from "../../../renderer/app/hooks"
import {
	deleteFileOrFolder,
	moveFileOrFolder,
	setCurrentPath,
} from "../../features/file-tree/file-tree-slice"

export const File: React.FC<{
	file: MDFile
	depth: number
	unsavedFiles: string[]
}> = ({ file, unsavedFiles, depth }) => {
	const dispatch = useAppDispatch()

	const [newName, setNewName] = React.useState(file ? file.readableName : "")
	const [isOpen, setIsOpen] = React.useState(false)

	const currentPath = useAppSelector((state) => state.fileTree.currentPath)

	return (
		file && (
			<div
				style={{ paddingLeft: `${(depth + 1) * 20}px` }}
				onClick={() => dispatch(setCurrentPath(file.path))}
				className={`w-full flex justify-between cursor-pointer py-1 pl-4 select-none truncate ${
					file.path === currentPath ? "bg-gray-300 dark:bg-gray-600" : ""
				}`}
			>
				<Conditional when={!isOpen}>
					<span className="flex-nowrap truncate">
						<Emoji icon="📄">{file.readableName}</Emoji>
					</span>
					<input
						autoFocus={isOpen}
						className="rounded-lg outline-none p-1 text-left text-xs text-gray-500"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()

								dispatch(
									moveFileOrFolder({
										node: file,
										newPath: file.path.replace(file.readableName, newName),
									}),
								)

								setIsOpen(false)
							}
						}}
					/>
				</Conditional>

				<Conditional when={unsavedFiles.includes(file.path)}>
					<Emoji icon="🔴" />
				</Conditional>

				<div className="flex space-x-2 pr-2 text-xs">
					{!isOpen && (
						<button className="p-1" onClick={() => setIsOpen(true)}>
							⚙️
						</button>
					)}

					{isOpen && (
						<button className="p-1" onClick={() => dispatch(deleteFileOrFolder(file))}>
							❌
						</button>
					)}
				</div>
			</div>
		)
	)
}
