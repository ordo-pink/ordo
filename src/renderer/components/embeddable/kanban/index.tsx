import type { ArbitraryFolder } from "../../../../global-context/types"

import React from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"

import { Column } from "./column"
import { Conditional } from "../../conditional"
import { findNode } from "../../../../utils/tree"
import { useAppSelector } from "../../../app/hooks"
import { useDispatch } from "react-redux"
import { createFileOrFolder, moveFileOrFolder } from "../../../features/file-tree/file-tree-slice"

export const Kanban: React.FC<{
	folder: string
}> = ({ folder }) => {
	const dispatch = useDispatch()
	const rootTree = useAppSelector((state) => state.fileTree.tree) as ArbitraryFolder

	const [tree, setTree] = React.useState<ArbitraryFolder>(null)

	React.useEffect(() => {
		if (rootTree) {
			setTree(
				findNode(rootTree, "path", rootTree.path.concat("/").concat(folder)) as ArbitraryFolder,
			)
		}
	}, [rootTree, folder])

	const [isAddingColumn, setIsAddingColumn] = React.useState(false)
	const [newColumnName, setNewColumnName] = React.useState("")

	const onDragEnd = (result: DropResult) => {
		if (result.source.droppableId !== result.destination.droppableId) {
			const node: ArbitraryFolder = findNode(
				tree,
				"path",
				`${result.source.droppableId}/${result.draggableId}.md`,
			)

			dispatch(
				moveFileOrFolder({
					node,
					newPath: `${result.destination.droppableId}/${result.draggableId}.md`,
				}),
			)
		}
	}

	return (
		tree &&
		tree.children && (
			<div className="overflow-x-auto font-sans bg-gray-50 dark:bg-gray-500 rounded-lg p-4 border border-gray-300 mx-auto">
				<div className="text-xs mb-2 text-gray-700 dark:text-gray-300 outline-none">
					{tree.readableName}
				</div>

				<DragDropContext onDragEnd={onDragEnd}>
					<div>
						{tree.children && (
							<Droppable droppableId={tree.path as string} direction="horizontal" type="column">
								{(provided) => (
									<div
										className="flex space-x-2"
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{tree.children.map(
											(column: ArbitraryFolder, index) =>
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
						autoFocus={isAddingColumn}
						className="mt-2 w-72 outline-none text-left rounded-lg p-2 text-xs text-gray-500 border border-dashed border-gray-500"
						value={newColumnName}
						onChange={(e) => setNewColumnName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()
								dispatch(createFileOrFolder({ name: newColumnName, node: tree }))
								setNewColumnName("")
							}
						}}
						onBlur={() => setIsAddingColumn(false)}
					/>
					<button
						onClick={() => setIsAddingColumn(true)}
						className={`mt-2 w-72 text-left rounded-lg p-2 text-xs text-gray-500 border border-dashed border-gray-500 ${
							!isAddingColumn && Boolean(newColumnName) && "border-yellow-700 text-yellow-700"
						}`}
					>
						+ Add column
						<Conditional when={!isAddingColumn && Boolean(newColumnName)}>
							<span className="ml-4">🟡</span>
						</Conditional>
					</button>
				</Conditional>
			</div>
		)
	)
}
