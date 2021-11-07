import type { Folder } from "../../../../main/apis/fs/types"

import React from "react"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { Card } from "./card"

export const Column: React.FC<{
	tree: Folder
	index: number
	setPath: (oldPath: string, newPath: string) => void
}> = ({ tree, index, setPath }) => {
	const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		setPath(tree.path, tree.path.replace(tree.readableName, e.target.textContent))
	}

	return (
		<Draggable draggableId={tree.path} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className={`w-full bg-gray-200 dark:bg-gray-600 bg-${tree.color}-100 dark:bg-${tree.color}-300 rounded-lg shadow-lg flex flex-col space-y-2`}
				>
					<div className="flex justify-between items-center p-2">
						<div
							contentEditable={true}
							suppressContentEditableWarning={true}
							className={`text-center outline-none text-xs text-${tree.color}-900 pt-2`}
							onBlur={onBlur}
						>
							{tree.readableName}
						</div>

						<div className="text-2xl" {...provided.dragHandleProps}>
							𐄞
						</div>
					</div>

					<Droppable direction="vertical" droppableId={tree.path} type="card">
						{(provided) => (
							<div
								className={`p-2 flex flex-col space-y-2 h-full`}
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{tree.children &&
									tree.children.map((item, index) => (
										<div key={item.path}>
											{item.isFile ? <Card item={item} index={index} setPath={setPath} /> : <></>}
										</div>
									))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>
			)}
		</Draggable>
	)
}
