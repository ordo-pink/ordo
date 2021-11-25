import type { ArbitraryFolder } from "../../../../global-context/types"

import React from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"

import { Column } from "./column"
import { Conditional } from "../../conditional"
import { findFileByPath } from "../../../../utils/tree"

export const Kanban: React.FC<{
	folder: string
}> = ({ folder }) => {
	const [tree, setTree] = React.useState({} as ArbitraryFolder)
	const [hash, setHash] = React.useState("")
	const [isAddingColumn, setIsAddingColumn] = React.useState(false)
	const [newColumnName, setNewColumnName] = React.useState("")

	const updateFileTree = () => {
		window.fileSystemAPI.listFolder(folder).then((data) => {
			setTree(data)
			setHash(data.hash)
			window.dispatchEvent(new CustomEvent("update-tree"))
		})
	}

	const updateColumnName = (oldPath: string, newPath: string) => {
		window.fileSystemAPI.move(oldPath, newPath).then(updateFileTree)
	}

	const createCard = (column: ArbitraryFolder, name: string) => {
		if (name.endsWith("/.md")) {
			return
		}

		window.fileSystemAPI.createFile(column, name).then(updateFileTree)
	}

	const createColumn = (column: ArbitraryFolder, name: string) => {
		if (findFileByPath(tree, name)) {
			return
		}

		window.fileSystemAPI.createFolder(column, name).then(updateFileTree)
	}

	const deleteCard = (cardPath: string) => {
		window.fileSystemAPI.delete(cardPath).then(updateFileTree)
	}

	const onDragEnd = (result: DropResult) => {
		if (result.source.droppableId !== result.destination.droppableId) {
			window.fileSystemAPI
				.move(
					`${result.source.droppableId}/${result.draggableId}.md`,
					`${result.destination.droppableId}/${result.draggableId}.md`,
				)
				.then(updateFileTree)
		}
	}

	React.useEffect(() => {
		window.fileSystemAPI.listFolder(folder).then((data) => {
			setTree(data)
			setHash(data.hash)
		})
	}, [folder, hash])

	return (
		<div className="overflow-x-auto bg-gray-50 dark:bg-gray-500 rounded-lg p-4 border border-gray-300 mx-auto">
			<div className="text-xs mb-2 text-gray-700 dark:text-gray-300 outline-none">
				{tree.readableName}
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
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
										(column: ArbitraryFolder, index) =>
											!column.isFile && (
												<Column
													key={column.path}
													tree={column}
													index={index}
													updateColumnName={updateColumnName}
													createCard={createCard}
													deleteCard={deleteCard}
												/>
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
							createColumn(tree, newColumnName)
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
}
