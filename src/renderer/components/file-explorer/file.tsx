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
}> = ({ file, setCurrentFile, currentFile, unsavedFiles, depth }) => (
	<div
		style={{ paddingLeft: `${(depth + 1) * 20}px` }}
		onClick={() => setCurrentFile(file.path)}
		className={`w-full flex justify-between cursor-pointer py-1 pl-4 select-none truncate ${
			file.path === currentFile ? "bg-gray-300 dark:bg-gray-600" : ""
		}`}
	>
		<Emoji icon="📄">{file.readableName}</Emoji>
		<Conditional when={unsavedFiles.includes(file.path)}>
			<Emoji icon="🔴" />
		</Conditional>
	</div>
)
