import React from "react"
import { FileMetadata } from "../../../main/apis/fs/types"
import { Conditional } from "../conditional"
import { Emoji } from "../emoji"

export const File: React.FC<{
	file: FileMetadata
	currentFile: string
	depth: number
	unsavedFiles: string[]
	setCurrentFile: (page: string) => void
	deleteFile: (path: string) => Promise<void>
	rename: (oldPath: string, newPath: string) => Promise<void>
}> = ({ file, setCurrentFile, currentFile, unsavedFiles, depth, deleteFile, rename }) => {
	const [newName, setNewName] = React.useState(file.readableName)
	const [isRenaming, setIsRenaming] = React.useState(false)

	return (
		<div
			style={{ paddingLeft: `${(depth + 1) * 20}px` }}
			onClick={() => setCurrentFile(file.path)}
			className={`w-full flex justify-between cursor-pointer py-1 pl-4 select-none truncate ${
				file.path === currentFile ? "bg-gray-300 dark:bg-gray-600" : ""
			}`}
		>
			<Conditional when={!isRenaming}>
				<span className="flex-nowrap truncate">
					<Emoji icon="📄">{file.readableName}</Emoji>
				</span>
				<input
					autoFocus={true}
					className="rounded-lg outline-none p-1 text-left text-xs text-gray-500"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							rename(file.path, file.path.replace(file.readableName, newName))
						}
					}}
					onBlur={() => setIsRenaming(false)}
				/>
			</Conditional>
			<div className="flex space-x-2 pr-2">
				<Conditional when={unsavedFiles.includes(file.path)}>
					<Emoji icon="🔴" />
				</Conditional>

				<button
					className="rounded-lg p-1 text-left text-xs text-gray-500"
					onClick={() => setIsRenaming(true)}
				>
					✏️
				</button>

				<button
					className="rounded-lg p-1 text-left text-xs text-gray-500"
					onClick={() => deleteFile(file.path)}
				>
					❌
				</button>
			</div>
		</div>
	)
}
