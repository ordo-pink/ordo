import React from "react"
import { Folder as TFolder } from "../../../main/apis/fs/types"
import { Conditional } from "../conditional"

import { Emoji } from "../emoji"

export const Folder: React.FC<{
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
	collapsed: boolean
	folder: TFolder
	depth: number
	createFile: (path: string) => Promise<void>
	createFolder: (path: string) => Promise<void>
}> = ({ setCollapsed, collapsed, folder, depth, createFile, createFolder }) => {
	const [isAddingFile, setIsAddingFile] = React.useState(false)
	const [isAddingFolder, setIsAddingFolder] = React.useState(false)
	const [newFileName, setNewFileName] = React.useState("")
	const [newFolderName, setNewFolderName] = React.useState("")

	const icon = collapsed ? "▶" : "▼"

	const toggleFolder = () => {
		setCollapsed(!collapsed)
	}

	return (
		<div className="w-full cursor-pointer py-1">
			<div
				style={{ paddingLeft: `${depth * 20}px` }}
				className="flex flex-shrink justify-between select-none"
			>
				<span className="flex-nowrap truncate" onClick={toggleFolder}>
					<Emoji icon={icon}>{folder.readableName}</Emoji>
				</span>
				<div className="flex align-middle justify-end space-x-2 pr-2">
					<Conditional when={isAddingFile}>
						<input
							autoFocus={true}
							className="rounded-lg outline-none p-1 text-left text-xs text-gray-500 border border-dashed border-gray-500"
							value={newFileName}
							style={{ marginLeft: `${depth * 20}px` }}
							onChange={(e) => setNewFileName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									createFile(`${folder.path}/${newFileName}.md`)
									setNewFileName("")
								}
							}}
							onBlur={() => setIsAddingFile(false)}
						/>
						<button
							onClick={() => setIsAddingFile(true)}
							className={`rounded-lg p-1 text-left text-xs text-gray-500 border border-dashed border-gray-500`}
						>
							📑
						</button>
					</Conditional>
					<Conditional when={isAddingFolder}>
						<input
							autoFocus={true}
							className="rounded-lg outline-none p-1 text-left text-xs text-gray-500 border border-dashed border-gray-500"
							value={newFolderName}
							onChange={(e) => setNewFolderName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									createFolder(`${folder.path}/${newFolderName}`)
									setNewFolderName("")
								}
							}}
							onBlur={() => setIsAddingFolder(false)}
						/>
						<button
							onClick={() => setIsAddingFolder(true)}
							className={`rounded-lg p-1 text-left text-xs text-gray-500 border border-dashed border-gray-500`}
						>
							🗂
						</button>
					</Conditional>
				</div>
			</div>
		</div>
	)
}
