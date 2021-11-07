import type { Folder } from "../../../../main/apis/fs/types"

import React from "react"
import { DragDropContext, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd"
import { Column } from "./column"

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

	const setPath = (oldPath: string, newPath: string) => {
		window.fileSystemAPI.move(oldPath, newPath).then(() => {
			window.fileSystemAPI.listFolder(folder).then((data) => {
				setTree(data)
				setHash(data.hash)
			})
		})
	}

	// const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
	// 	setPath(tree.path, tree.path.replace(tree.readableName, e.target.textContent))
	// }

	const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
		if (result.source.droppableId !== result.destination.droppableId) {
			window.fileSystemAPI
				.move(
					`${result.source.droppableId}/${result.draggableId}.md`,
					`${result.destination.droppableId}/${result.draggableId}.md`,
				)
				.then(() => {
					window.fileSystemAPI.listFolder(folder).then((data) => {
						setTree(data)
						setHash(data.hash)
					})
				})
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
		<div className="shadow-inner bg-gray-50 dark:bg-gray-500 rounded-lg p-4">
			<div
				// contentEditable={true}
				// suppressContentEditableWarning={true}
				className="text-center text-xs text-gray-700 dark:text-gray-300 outline-none"
				// onBlur={onBlur}
			>
				{tree.readableName}
			</div>
			<DragDropContext onDragEnd={onDragEnd}>
				<div className={`w-full bg-${tree.color}-200 dark:bg-gray-500 rounded-lg py-2`}>
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
												<Column key={column.path} tree={column} index={index} setPath={setPath} />
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
