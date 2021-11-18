import type { MDFile } from "../../../../global-context/types"

import React from "react"

import { Draggable } from "react-beautiful-dnd"

export const Card: React.FC<{
	item: MDFile
	index: number
	updateCardName: (oldPath: string, newPath: string) => void
	deleteCard: (cardName: string) => void
}> = ({ item, index, updateCardName, deleteCard }) => {
	const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		updateCardName(item.path, item.path.replace(item.readableName, e.target.textContent))
	}

	return (
		<Draggable draggableId={item.readableName} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg w-full flex flex-col justify-between px-4 py-2"
				>
					<div
						className="outline-none"
						contentEditable={true}
						suppressContentEditableWarning={true}
						onBlur={onBlur}
					>
						{item.readableName}{" "}
					</div>

					<div className="flex space-x-2">
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

						<button
							className="text-sxl"
							onClick={() => {
								deleteCard(item.path)
							}}
						>
							⤫
						</button>
					</div>
				</div>
			)}
		</Draggable>
	)
}
