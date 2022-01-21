import React from "react"
import Scrollbars from "react-custom-scrollbars"
import { useAppSelector } from "../../common/store-hooks"
import { OrdoFile, OrdoFolder } from "../../application/types"
import { File } from "./file"
import { Folder } from "./folder"

export const FileExplorer: React.FC = () => {
	const tree = useAppSelector((state) => state.application.tree)

	if (!tree) {
		return null
	}

	return (
		<Scrollbars className="relative">
			<div>
				{!tree.collapsed &&
					tree.children.map((child) => (
						<div className="cursor-pointer" key={child.path}>
							{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
						</div>
					))}
			</div>
		</Scrollbars>
	)
}
