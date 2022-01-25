import React from "react"
import { OrdoFolder, OrdoFile } from "../../application/types"
import { File } from "./file"
import { getCollapseIcon, getFolderIcon } from "../../application/get-folder-icon"

export const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const Icon = folder && getCollapseIcon(folder)
	const FolderIcon = folder && getFolderIcon(folder)

	return (
		folder && (
			<>
				<div
					style={{ paddingLeft: folder.depth * 12 + "px" }}
					className={`flex space-x-2 items-center`}
					onClick={() => {
						window.ordo.emit("@application/update-folder", [folder.path, { collapsed: !folder.collapsed }])
					}}
				>
					<Icon />
					<FolderIcon className={`text-gray-500 text-${folder.color}-500`} />
					<div className="pr-2 truncate text-gray-700 py-0.5">{folder.readableName}</div>
				</div>
				{!folder.collapsed &&
					folder.children.map((child) => (
						<div key={child.path}>
							{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
						</div>
					))}
			</>
		)
	)
}
