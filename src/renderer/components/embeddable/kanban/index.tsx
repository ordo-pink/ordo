import type { OrdoFolder } from "../../../../global-context/types"

import React from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"

import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { createFileOrFolder, moveFileOrFolder } from "../../../features/file-tree/file-tree-slice"

import { Column } from "./column"
import { Conditional } from "../../conditional"

import { findNode } from "../../../../utils/tree"
import { escapeSlashes } from "../../../../utils/string"

export const Kanban: React.FC<{
	folder: string
}> = ({ folder }) => {
	const dispatch = useAppDispatch()
	const rootTree = useAppSelector((state) => state.fileTree.tree) as OrdoFolder

	const [tree, setTree] = React.useState<OrdoFolder>(null)
	const [isAddingColumn, setIsAddingColumn] = React.useState(false)
	const [newColumnName, setNewColumnName] = React.useState("")

	React.useEffect(() => {
		if (rootTree) {
			setTree(findNode(rootTree, "path", rootTree.path.concat("/").concat(folder)) as OrdoFolder)
		}
	}, [rootTree, folder, tree])

	const unsavedNewCardChangesClass =
		!isAddingColumn && Boolean(newColumnName) && "border-yellow-700 text-yellow-700"
	const hasUnsavedNewCardChanges = !isAddingColumn && Boolean(newColumnName)

	const addNewCardButtonClickHandler = () => setIsAddingColumn(true)
	const newColumnNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
		setNewColumnName(e.target.value)
	const newColumnNameBlurHandler = () => setIsAddingColumn(false)
	const newColumnNameKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			dispatch(
				createFileOrFolder({
					name: newColumnName.endsWith("/")
						? escapeSlashes(newColumnName)
						: `${escapeSlashes(newColumnName)}/`,
					node: tree,
				}),
			)
			setNewColumnName("")
		}

		if (e.key === "Escape") {
			e.preventDefault()
			setNewColumnName("")
			setIsAddingColumn(false)
		}
	}
	const dragEndHandler = (result: DropResult) => {
		const name = result.draggableId.endsWith(".md")
			? result.draggableId
			: `${result.draggableId}.md`

		const oldPath = `${result.source.droppableId}/${name}`
		const newPath = `${result.destination.droppableId}/${name}`

		if (result.source.droppableId !== result.destination.droppableId) {
			const node = findNode(tree, "path", oldPath) as OrdoFolder

			dispatch(moveFileOrFolder({ node, newPath: escapeSlashes(newPath) }))
		}
	}

	return (
		tree &&
		tree.children && (
			<div className="overflow-x-auto font-sans bg-gray-50 dark:bg-gray-500 rounded-lg p-4 border border-gray-300 mx-auto">
				<div className="text-xs mb-2 text-gray-700 dark:text-gray-300 outline-none">
					{tree.readableName}
				</div>

				<DragDropContext onDragEnd={dragEndHandler}>
					<div>
						{tree.children && (
							<Droppable droppableId={tree.path} direction="horizontal" type="column">
								{(provided) => (
									<div
										className="flex space-x-2"
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{tree.children.map(
											(column: OrdoFolder, index) =>
												!column.isFile && (
													<Column key={column.path} treePath={column.path} index={index} />
												),
										)}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						)}
					</div>
				</DragDropContext>

				<Conditional when={isAddingColumn}>
					<input
						className="mt-2 w-72 outline-none text-left rounded-lg p-2 text-xs text-gray-500 border border-dashed border-gray-500"
						autoFocus={isAddingColumn}
						value={newColumnName}
						onChange={newColumnNameChangeHandler}
						onKeyDown={newColumnNameKeyDownHandler}
						onBlur={newColumnNameBlurHandler}
					/>
					<div
						onClick={addNewCardButtonClickHandler}
						className={`mt-2 w-72 text-left rounded-lg p-2 text-xs text-gray-500 border border-dashed border-gray-500 ${unsavedNewCardChangesClass}`}
					>
						+ Add column
						<Conditional when={hasUnsavedNewCardChanges}>
							<span className="ml-4">🟡</span>
						</Conditional>
					</div>
				</Conditional>
			</div>
		)
	)
}
