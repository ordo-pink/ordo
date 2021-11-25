import type { MDFile } from "../../../../global-context/types"

import React from "react"

import { Draggable } from "react-beautiful-dnd"

export const Card: React.FC<{
	item: MDFile
	index: number
	updateCardName: (oldPath: string, newPath: string) => void
	deleteCard: (cardName: string) => void
}> = ({ item, index, updateCardName, deleteCard }) => {
	const [editable, setEditable] = React.useState(false)
	const ref = React.useRef(null)

	const onBlur = () => {
		updateCardName(item.path, item.path.replace(item.readableName, ref.current.textContent))
	}

	const onClick = () => setEditable(true)

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()

			updateCardName(item.path, item.path.replace(item.readableName, ref.current.textContent))

			setEditable(false)
		}
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
						ref={ref}
						className="outline-none"
						contentEditable={editable}
						suppressContentEditableWarning={true}
						onKeyDown={onKeyDown}
						onClick={onClick}
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
