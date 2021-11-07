import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { FileMetadata } from "../../../../main/apis/fs/types"

export const Card: React.FC<{
	item: FileMetadata
	index: number
	setPath: (oldPath: string, newPath: string) => void
}> = ({ item, index, setPath }) => {
	const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		setPath(item.path, item.path.replace(item.readableName, e.target.textContent))
	}

	return (
		<Draggable draggableId={item.readableName} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg w-full flex items-center justify-between p-4"
				>
					<div
						className="outline-none"
						contentEditable={true}
						suppressContentEditableWarning={true}
						onBlur={onBlur}
					>
						{item.readableName}
					</div>
					<div className="text-2xl" {...provided.dragHandleProps}>
						𐄞
					</div>
				</div>
			)}
		</Draggable>
	)
}
