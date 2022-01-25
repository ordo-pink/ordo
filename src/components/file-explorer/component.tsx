import React from "react"
import Scrollbars from "react-custom-scrollbars"
import { useAppSelector } from "../../common/store-hooks"
import { OrdoFile, OrdoFolder } from "../../application/types"
import { File } from "./file"
import { Folder } from "./folder"
import { Header } from "./header"

export const FileExplorer: React.FC = () => {
	const tree = useAppSelector((state) => state.application.tree)

	if (!tree) {
		return null
	}

	return (
		<>
			<div className="flex w-full items-center justify-between bg-gray-200 py-1 px-3 rounded-t-lg">
				<Header />
			</div>
			<div className=" h-[97.7%]">
				{tree.collapsed ? null : (
					<Scrollbars>
						<div>
							{tree.children.map((child) => (
								<div className="cursor-pointer" key={child.path}>
									{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
								</div>
							))}
						</div>
					</Scrollbars>
				)}
			</div>
		</>
	)
}
