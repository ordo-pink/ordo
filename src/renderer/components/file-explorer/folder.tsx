import type { ArbitraryFolder } from "../../../global-context/types"

import React from "react"

import { Conditional } from "../conditional"
import { Emoji } from "../emoji"
import { useAppDispatch } from "../../app/hooks"
import { toggleCreator } from "../../features/ui/ui-slice"
import { deleteFileOrFolder, moveFileOrFolder } from "../../features/file-tree/file-tree-slice"

export const Folder: React.FC<{
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
	collapsed: boolean
	folder: ArbitraryFolder
	depth: number
}> = ({ setCollapsed, collapsed, folder, depth }) => {
	const dispatch = useAppDispatch()

	const [name, setName] = React.useState(folder.readableName)
	const [isOpen, setIsOpen] = React.useState(false)

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

								dispatch(
									moveFileOrFolder({
										node: folder,
										newPath: folder.path.replace(folder.readableName, name),
									}),
								)

								setIsOpen(false)
							}
						}}
					/>
				</Conditional>

				<div className="flex space-x-2 text-xs pr-2">
					{!isOpen && (
						<div>
							<button
								onClick={() => {
									dispatch(toggleCreator(folder))
								}}
								className="p-1"
							>
								➕
							</button>

							<button className="p-1" onClick={() => setIsOpen(true)}>
								⚙️
							</button>
						</div>
					)}

					{isOpen && (
						<button className="p-1" onClick={() => dispatch(deleteFileOrFolder(folder))}>
							❌
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
