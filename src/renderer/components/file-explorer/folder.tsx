import type { Folder as TFolder } from "../../../main/apis/fs/types"

import React from "react"

import { useDropdown } from "../../hooks/use-dropdown"
import { Conditional } from "../conditional"
import { Emoji } from "../emoji"

export const Folder: React.FC<{
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
	collapsed: boolean
	folder: TFolder
	depth: number
	createFile: (folder: TFolder, name: string) => Promise<void>
	createFolder: (folder: TFolder, name: string) => Promise<void>
	deleteFolder: (path: string) => Promise<void>
	rename: (oldPath: string, newPath: string) => Promise<void>
}> = ({
	setCollapsed,
	collapsed,
	folder,
	depth,
	createFile,
	createFolder,
	deleteFolder,
	rename,
}) => {
	const [name, setName] = React.useState(folder.readableName)
	const [ref, isOpen, open] = useDropdown<HTMLDivElement>()
	const [creatorRef, creatorIsOpen, openCreator, closeCreator] = useDropdown<HTMLDivElement>()
	const [entityType, setEntityType] = React.useState<"Folder" | "file" | "">("")
	const [creationName, setCreationName] = React.useState("")

	const icon = collapsed ? "▶" : "▼"

	const toggleFolder = () => {
		setCollapsed(!collapsed)
	}

	return (
		<div className="w-full cursor-pointer py-1">
			<div style={{ paddingLeft: `${depth * 20}px` }} className="flex justify-between select-none">
				<Conditional when={!isOpen}>
					<span className="flex-nowrap truncate" onClick={toggleFolder}>
						<Emoji icon={icon}>{folder.readableName}</Emoji>
					</span>
					<input
						autoFocus={isOpen}
						className="rounded-lg outline-none p-1 text-left text-xs text-gray-500"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()

								rename(folder.path, folder.path.replace(folder.readableName, name))
							}
						}}
					/>
				</Conditional>

				<div ref={ref} className="flex space-x-2 text-xs pr-2">
					{!isOpen && (
						<div>
							<button
								onClick={() => {
									setEntityType("file")
									openCreator()
								}}
								className="p-1"
							>
								📑
							</button>

							<button
								onClick={() => {
									setEntityType("Folder")
									openCreator()
								}}
								className="p-1"
							>
								🗂
							</button>

							<button className="p-1" onClick={open}>
								⚙️
							</button>
						</div>
					)}

					{isOpen && (
						<button className="p-1" onClick={() => deleteFolder(folder.path)}>
							❌
						</button>
					)}
				</div>
			</div>

			{creatorIsOpen && (
				<div
					ref={creatorRef}
					style={{
						top: "20%",
						left: "50%",
						transform: "translate(-50%, 0)",
						width: "40%",
						minWidth: "400px",
					}}
					className="fixed rounded-lg shadow-xl p-4 bg-gray-50"
				>
					<label className="p-1 flex">
						<span>{folder.path}/</span>
						<input
							autoFocus={creatorIsOpen}
							className="w-full outline-none bg-gray-50"
							type="text"
							onChange={(e) => setCreationName(e.target.value)}
							value={creationName}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault()

									if (entityType === "file") {
										createFile(folder, creationName)
									} else if (entityType === "Folder") {
										createFolder(folder, creationName)
									}

									setEntityType("")
									setCreationName("")
									closeCreator()
								}
							}}
						/>
						<Conditional when={entityType === "file"}>
							<span>.md</span>
						</Conditional>
					</label>

					<div className="text-xs text-gray-600 text-center mt-2">
						Press <kbd className="bg-pink-300 p-1 rounded-md">Enter</kbd> to apply changes or{" "}
						<kbd className="bg-pink-300 p-1 rounded-md">Esc</kbd> to drop.
					</div>
				</div>
			)}
		</div>
	)
}
