import React from "react"
import { Folder as TFolder } from "../../../main/apis/fs/types"

import { Emoji } from "../emoji"

export const Folder: React.FC<{
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
	collapsed: boolean
	folder: TFolder
	depth: number
}> = ({ setCollapsed, collapsed, folder, depth }) => {
	const icon = collapsed ? "📁" : "📂"

	const toggleFolder = () => {
		setCollapsed(!collapsed)
	}

	return (
		<div className="w-full cursor-pointer truncate py-1">
			<div
				style={{ paddingLeft: `${depth * 20}px` }}
				className="flex justify-between select-none"
				onClick={toggleFolder}
			>
				<Emoji icon={icon}>{folder.readableName}</Emoji>
			</div>
		</div>
	)
}
