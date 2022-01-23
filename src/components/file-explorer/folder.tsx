import React from "react"
import { useAppSelector, useAppDispatch } from "../../common/store-hooks"
import { OrdoFolder, OrdoFile } from "../../application/types"
import { File } from "./file"
import {
	HiFolder,
	HiFolderOpen,
	HiOutlineChevronDown,
	HiOutlineChevronRight,
	HiOutlineFolder,
	HiOutlineFolderOpen,
} from "react-icons/hi"

const getCollapseIcon = (folder: OrdoFolder) => (folder.collapsed ? HiOutlineChevronRight : HiOutlineChevronDown)
const getFolderIcon = (folder: OrdoFolder) =>
	folder.collapsed
		? folder.children.length
			? HiFolder
			: HiOutlineFolder
		: folder.children.length
		? HiFolderOpen
		: HiOutlineFolderOpen

export const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const Icon = folder && getCollapseIcon(folder)
	const FolderIcon = folder && getFolderIcon(folder)

	const [createdName, setCreatedName] = React.useState("")

	// const selected = useAppSelector((state) => state.explorerSelection)
	// const showCreateFile = useAppSelector((state) => state.showCreateFile)
	// const showCreateFolder = useAppSelector((state) => state.showCreateFolder)
	// const showInput = (showCreateFolder || showCreateFile) && selected === folder.path

	return (
		folder && (
			<>
				<div
					style={{ paddingLeft: folder.depth * 12 + "px" }}
					className={`flex space-x-2 items-center`}
					onClick={() => {
						// dispatch(select(folder.path))
						// dispatch(updateFolder({ path: folder.path, update: { collapsed: !folder.collapsed } }))
					}}
				>
					<Icon />
					<FolderIcon className={`text-gray-500 text-${folder.color}-500`} />
					<div className="pr-2 truncate text-gray-700 py-0.5">{folder.readableName}</div>
				</div>
				{/* {showInput && (
					<input
						style={{ marginLeft: (folder.depth + 1.25) * 12 + "px" }}
						autoFocus={showInput}
						className="w-full"
						type="text"
						onFocus={() => dispatch(setEditorSelection(false))}
						value={createdName}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.preventDefault()

								dispatch(setEditorSelection(true))
								dispatch(setShowCreateFile(false))
								dispatch(setShowCreateFolder(false))
								setCreatedName("")
							} else if (e.key === "Enter") {
								e.preventDefault()

								dispatch(
									showCreateFile
										? createFile({ currentlySelectedPath: selected, name: createdName })
										: createFolder({ currentlySelectedPath: selected, name: createdName }),
								)

								dispatch(setEditorSelection(true))
								dispatch(setShowCreateFile(false))
								dispatch(setShowCreateFolder(false))

								setCreatedName("")
							}
						}}
						onChange={(e) => setCreatedName(e.target.value)}
					/>
				)} */}
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
