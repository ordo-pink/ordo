import type { OrdoFolder, MDFile } from "../../../global-context/types"

import React from "react"
import { ifElse, tap, pipe } from "ramda"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { toggleCreator } from "../../features/ui/ui-slice"
import {
	deleteFileOrFolder,
	editNode,
	moveFileOrFolder,
} from "../../features/file-tree/file-tree-slice"

import { Conditional } from "../conditional"
import { File } from "./file"

import { hasCurrentlyOpenedFile } from "../../../utils/tree"
import { isFolder } from "../../../global-context/init"
import { Emoji } from "../emoji"

type FolderProps = {
	folder?: OrdoFolder
	unsavedFiles: string[]
}

export const Folder: React.FC<FolderProps> = ({ folder, unsavedFiles }) => {
	const dispatch = useAppDispatch()
	const rootFolder = useAppSelector((state) => state.fileTree.tree)
	const currentPath = useAppSelector((state) => state.fileTree.currentPath)

	const [name, setName] = React.useState("")
	const [isEditing, setIsEditing] = React.useState(false)
	const [optionsVisible, setOptionsVisible] = React.useState(false)

	const tree = folder ?? rootFolder

	const icon = tree && tree.collapsed ? "→" : "↓"
	const folderIcon = tree && tree.collapsed ? "📁" : "📂"
	const subTreeVisibilityClass = tree && tree.collapsed ? "hidden" : "block"
	const hasCurrentlyOpenFileClass =
		tree && tree.collapsed && hasCurrentlyOpenedFile(tree, currentPath)
			? "bg-gray-300 dark:bg-gray-600"
			: ""
	const paddingLeft = tree && `${(tree.depth + 1) * 10}px`
	const canEdit = tree && rootFolder && tree.path !== rootFolder.path && !isEditing

	React.useEffect(() => {
		tree && setName(tree.readableName)
	}, [tree])

	const toggleFolder = () =>
		dispatch(editNode({ node: tree, increment: { collapsed: !tree.collapsed } }))

	const addClickHandler = () => dispatch(toggleCreator(tree))
	const removeClickHandler = () => dispatch(deleteFileOrFolder(tree))
	const editClickHandler = () => setIsEditing(true)
	const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
	const folderMouseEnterHandler = () => setOptionsVisible(true)
	const folderMouseLeaveHandler = () => setOptionsVisible(false)

	const isEnter = (e: KeyboardEvent) => e.key === "Enter"
	const preventDefault = tap((e: Event) => e.preventDefault())
	const move = tap(() =>
		dispatch(
			moveFileOrFolder({
				node: tree,
				newPath: tree.path.replace(tree.readableName, name),
			}),
		),
	)
	const stopEditing = tap(() => setIsEditing(false))
	const noOp = (): null => null

	const nameKeyDownHandler = ifElse(isEnter, pipe(preventDefault, move, stopEditing), noOp)

	return (
		tree && (
			<div className="cursor-pointer">
				<div
					className={`flex justify-between py-1 select-none ${hasCurrentlyOpenFileClass}`}
					style={{ paddingLeft }}
					onMouseEnter={folderMouseEnterHandler}
					onMouseLeave={folderMouseLeaveHandler}
				>
					<Conditional when={!isEditing}>
						<span className="flex-nowrap truncate" onClick={toggleFolder}>
							<span className="text-sm align-baseline text-gray-500">
								{icon}
								{"  "}
							</span>
							<Emoji icon={folderIcon}>{tree.readableName}</Emoji>
						</span>
						<input
							className="rounded-lg outline-none p-1 text-left text-xs text-gray-500"
							autoFocus={isEditing}
							value={name}
							onChange={nameChangeHandler}
							onKeyDown={nameKeyDownHandler}
						/>
					</Conditional>

					{optionsVisible && (
						<div className="flex space-x-2 text-xs">
							{canEdit && (
								<div>
									<button className="p-1" onClick={addClickHandler}>
										➕
									</button>

									<button className="p-1" onClick={editClickHandler}>
										⚙️
									</button>
								</div>
							)}

							{isEditing && (
								<button className="p-1" onClick={removeClickHandler}>
									❌
								</button>
							)}
						</div>
					)}
				</div>

				<div className={subTreeVisibilityClass}>
					{tree.children &&
						tree.children.map((fileOrFolder) => (
							<Conditional key={fileOrFolder.path} when={isFolder(fileOrFolder)}>
								<Folder folder={fileOrFolder as OrdoFolder} unsavedFiles={unsavedFiles} />
								<File unsavedFiles={unsavedFiles} file={fileOrFolder as MDFile} />
							</Conditional>
						))}
				</div>
			</div>
		)
	)
}
