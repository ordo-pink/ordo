import type { OrdoFile } from "../../../global-context/types"

import React from "react"
import { tap, pipe, ifElse } from "ramda"

import { useAppDispatch, useAppSelector } from "../../../renderer/app/hooks"
import {
	deleteFileOrFolder,
	moveFileOrFolder,
	setCurrentPath,
} from "../../features/file-tree/file-tree-slice"

import { Conditional } from "../conditional"
import { Emoji } from "../emoji"

export const File: React.FC<{
	file: OrdoFile
	depth: number
	unsavedFiles: string[]
}> = ({ file, unsavedFiles, depth }) => {
	const dispatch = useAppDispatch()

	const currentPath = useAppSelector((state) => state.fileTree.currentPath)

	const [newName, setNewName] = React.useState(file ? file.readableName : "")
	const [isEditing, setIsEditing] = React.useState(false)

	const paddingLeft = `${(depth + 1) * 20}px`
	const hasUnsavedContent = unsavedFiles.includes(file.path)
	const highlightCurrentFileClass = file.path === currentPath ? "bg-gray-300 dark:bg-gray-600" : ""

	const fileClickHandler = () => dispatch(setCurrentPath(file.path))
	const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)
	const removeClickHandler = () => dispatch(deleteFileOrFolder(file))
	const editClickHandler = () => setIsEditing(true)

	const isEnter = (e: KeyboardEvent) => e.key === "Enter"
	const preventDefault = tap((e: Event) => e.preventDefault())
	const move = tap(() =>
		dispatch(
			moveFileOrFolder({
				node: file,
				newPath: file.path.replace(file.readableName, newName),
			}),
		),
	)
	const stopEditing = tap(() => setIsEditing(false))
	const noOp = (): null => null

	const nameKeyDownHandler = ifElse(isEnter, pipe(preventDefault, move, stopEditing), noOp)

	return (
		file && (
			<div
				className={`w-full flex justify-between cursor-pointer py-1 pl-4 select-none truncate ${highlightCurrentFileClass}`}
				style={{ paddingLeft }}
			>
				<Conditional when={!isEditing}>
					<span className="flex-nowrap truncate" onClick={fileClickHandler}>
						<Emoji icon="📄">{file.readableName}</Emoji>
					</span>
					<input
						className="rounded-lg outline-none p-1 text-left text-xs text-gray-500"
						autoFocus={isEditing}
						value={newName}
						onChange={nameChangeHandler}
						onKeyDown={nameKeyDownHandler}
					/>
				</Conditional>

				<Conditional when={hasUnsavedContent}>
					<Emoji icon="🔴" />
				</Conditional>

				<div className="flex space-x-2 pr-3 text-xs">
					<Conditional when={isEditing}>
						<button onClick={removeClickHandler}>❌</button>
						<button onClick={editClickHandler}>⚙️</button>
					</Conditional>
				</div>
			</div>
		)
	)
}
