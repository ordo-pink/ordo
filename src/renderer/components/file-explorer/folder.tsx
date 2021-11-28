import type { ArbitraryFolder } from "../../../global-context/types"

import React from "react"

import { useDropdown } from "../../hooks/use-dropdown"
import { Conditional } from "../conditional"
import { Emoji } from "../emoji"
import { useAppDispatch } from "../../app/hooks"
import { toggleCreator } from "../../features/ui/ui-slice"

export const Folder: React.FC<{
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
	collapsed: boolean
	folder: ArbitraryFolder
	depth: number
	deleteItem: (path: string) => Promise<void>
	rename: (oldPath: string, newPath: string) => Promise<void>
}> = ({ setCollapsed, collapsed, folder, depth, deleteItem, rename }) => {
	const dispatch = useAppDispatch()

	const [name, setName] = React.useState(folder.readableName)
	const [ref, isOpen, open] = useDropdown<HTMLDivElement>()

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
									dispatch(toggleCreator(folder))
								}}
								className="p-1"
							>
								➕
							</button>

							<button className="p-1" onClick={open}>
								⚙️
							</button>
						</div>
					)}

					{isOpen && (
						<button className="p-1" onClick={() => deleteItem(folder.path)}>
							❌
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
