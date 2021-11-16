import type { Folder } from "../../../../main/apis/fs/types"

import React from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import { Column } from "./column"
import { Conditional } from "../../conditional"

export const Kanban: React.FC<{
	folder: string
	// actionProperty: string
	// bottomLeft: string
	// bottomRight: string
	// topLeft: string
	// topRight: string
}> = ({ folder }) => {
	const [tree, setTree] = React.useState<Folder>({} as Folder)
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

	const setPath = (oldPath: string, newPath: string) => {
		window.fileSystemAPI.move(oldPath, newPath).then(updateFileTree)
	}

	const createCard = (cardPath: string) => {
		window.fileSystemAPI.createFile(cardPath).then(updateFileTree)
	}

	const createColumn = (columnPath: string) => {
		window.fileSystemAPI.createFolder(columnPath).then(updateFileTree)
	}

	const deleteCard = (cardPath: string) => {
		window.fileSystemAPI.deleteFile(cardPath).then(updateFileTree)
	}

	// const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
	// 	setPath(tree.path, tree.path.replace(tree.readableName, e.target.textContent))
	// }

	const onDragEnd = (result: DropResult) => {
		// TODO: Adding files in column, adding columns on the board!!!
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

	// TODO: Collect colors in one place
	return (
		<div className="w-full overflow-x-auto p-2 rounded-lg">
			<div
				// contentEditable={true}
				// suppressContentEditableWarning={true}
				className="text-center text-xs text-gray-700 dark:text-gray-300 outline-none"
				// onBlur={onBlur}
			>
				{tree.readableName}
				<Conditional when={isAddingColumn}>
					<input
						autoFocus={isAddingColumn}
						className="ml-4 w-64 outline-none text-left rounded-lg p-2 text-xs text-gray-500 border border-dashed border-gray-500"
						value={newColumnName}
						onChange={(e) => setNewColumnName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								createColumn(`${tree.path}/${newColumnName}`)
								setNewColumnName("")
							}
						}}
						onBlur={() => setIsAddingColumn(false)}
					/>
					<button
						onClick={() => setIsAddingColumn(true)}
						className={`ml-4 w-64 text-left rounded-lg p-2 text-xs text-gray-500 border border-dashed border-gray-500 ${
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
			<DragDropContext onDragEnd={onDragEnd}>
				<div className={`bg-${tree.color}-200 dark:bg-gray-500 rounded-lg py-2`}>
					{tree.children && (
						<Droppable droppableId={tree.path} direction="horizontal" type="column">
							{(provided) => (
								<div
									className="flex space-x-2"
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{tree.children.map(
										(column: Folder, index) =>
											column.isFolder && (
												<Column
													key={column.path}
													tree={column}
													index={index}
													updateColumnName={setPath}
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
		</div>
	)
}
