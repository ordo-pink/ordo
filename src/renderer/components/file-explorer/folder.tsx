import type { ArbitraryFolder, MDFile } from "../../../global-context/types"

import React from "react"
import { ifElse, tap, pipe } from "ramda"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { toggleCreator } from "../../features/ui/ui-slice"
import { deleteFileOrFolder, moveFileOrFolder } from "../../features/file-tree/file-tree-slice"

import { Conditional } from "../conditional"
import { Emoji } from "../emoji"
import { File } from "./file"

import { hasCurrentlyOpenedFile } from "../../../utils/tree"
import { isFolder } from "../../../global-context/init"

type FolderProps = {
	folder?: ArbitraryFolder
	depth?: number
	unsavedFiles: string[]
}

export const Folder: React.FC<FolderProps> = ({ folder, depth = 0, unsavedFiles }) => {
	const dispatch = useAppDispatch()
	const rootFolder = useAppSelector((state) => state.fileTree.tree)
	const currentPath = useAppSelector((state) => state.fileTree.currentPath)

	const [name, setName] = React.useState("")
	const [isEditing, setIsEditing] = React.useState(false)
	const [collapsed, setCollapsed] = React.useState(true)

	const tree = folder ? folder : rootFolder
	const icon = collapsed ? "▶" : "▼"
	const paddingLeft = `${depth * 20}px`
	const canEdit = tree && rootFolder && tree.path !== rootFolder.path && !isEditing
	const subTreeVisibilityClass = collapsed ? "hidden" : "block"

	React.useEffect(() => {
		tree && setName(tree.readableName)
	}, [tree])

	React.useEffect(() => {
		if (tree && currentPath && hasCurrentlyOpenedFile(tree, currentPath)) {
			setCollapsed(false)
		}
	}, [currentPath, tree])

	const toggleFolder = () => setCollapsed(!collapsed)

	const addClickHandler = () => dispatch(toggleCreator(tree))
	const removeClickHandler = () => dispatch(deleteFileOrFolder(tree))
	const editClickHandler = () => setIsEditing(true)
	const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)

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
			<div className="cursor-pointer py-1">
				<div className="flex justify-between select-none" style={{ paddingLeft }}>
					<Conditional when={!isEditing}>
						<span className="flex-nowrap truncate" onClick={toggleFolder}>
							<Emoji icon={icon}>{tree.readableName}</Emoji>
						</span>
						<input
							className="rounded-lg outline-none p-1 text-left text-xs text-gray-500"
							autoFocus={isEditing}
							value={name}
							onChange={nameChangeHandler}
							onKeyDown={nameKeyDownHandler}
						/>
					</Conditional>

					<div className="flex space-x-2 text-xs pr-2">
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
				</div>

				<div className={subTreeVisibilityClass}>
					{tree.children &&
						tree.children.map((fileOrFolder) => (
							<Conditional key={fileOrFolder.path} when={isFolder(fileOrFolder)}>
								<Folder
									folder={fileOrFolder as ArbitraryFolder}
									unsavedFiles={unsavedFiles}
									depth={depth + 1}
								/>
								<File unsavedFiles={unsavedFiles} file={fileOrFolder as MDFile} depth={depth} />
							</Conditional>
						))}
				</div>
			</div>
		)
	)
}
