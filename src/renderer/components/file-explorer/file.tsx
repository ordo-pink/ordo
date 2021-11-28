import type { MDFile } from "../../../global-context/types"

import React from "react"

import { useDropdown } from "../../hooks/use-dropdown"
import { Conditional } from "../conditional"
import { Emoji } from "../emoji"
import { useAppDispatch, useAppSelector } from "../../../renderer/app/hooks"
import { deleteFileOrFolder } from "../../features/file-tree/file-tree-slice"

export const File: React.FC<{
	file: MDFile
	depth: number
	unsavedFiles: string[]
	setCurrentFile: (page: string) => void
	rename: (oldPath: string, newPath: string) => Promise<void>
}> = ({ file, setCurrentFile, unsavedFiles, depth, rename }) => {
	const dispatch = useAppDispatch()

	const [newName, setNewName] = React.useState(file ? file.readableName : "")
	const [ref, isOpen, open] = useDropdown<HTMLDivElement>()

	const currentPath = useAppSelector((state) => state.fileTree.currentPath)

	return (
		file && (
			<div
				style={{ paddingLeft: `${(depth + 1) * 20}px` }}
				onClick={() => setCurrentFile(file.path)}
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
								rename(file.path, file.path.replace(file.readableName, newName))
							}
						}}
					/>
				</Conditional>

				<Conditional when={unsavedFiles.includes(file.path)}>
					<Emoji icon="🔴" />
				</Conditional>

				<div ref={ref} className="flex space-x-2 pr-2 text-xs">
					{!isOpen && (
						<button className="p-1" onClick={open}>
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
