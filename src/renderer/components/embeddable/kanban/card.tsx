import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { FileMetadata } from "../../../../main/apis/fs/types"

export const Card: React.FC<{
	item: FileMetadata
	index: number
	updateCardName: (oldPath: string, newPath: string) => void
}> = ({ item, index, updateCardName }) => {
	const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		updateCardName(item.path, item.path.replace(item.readableName, e.target.textContent))
	}

	return (
		<Draggable draggableId={item.readableName} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg w-full flex items-center justify-between px-4 py-2"
				>
					<div
						className="outline-none"
						contentEditable={true}
						suppressContentEditableWarning={true}
						onBlur={onBlur}
					>
						{item.readableName}{" "}
					</div>

					<div className="self-start flex flex-col">
						<div className="text-xl" {...provided.dragHandleProps}>
							𐄞
						</div>

						<button
							className="text-xl"
							onClick={(e) => {
								e.preventDefault()
								window.dispatchEvent(
									new CustomEvent("set-current-file", {
										detail: { path: item.path },
									}),
								)
							}}
						>
							⇱
						</button>
					</div>
				</div>
			)}
		</Draggable>
	)
}
