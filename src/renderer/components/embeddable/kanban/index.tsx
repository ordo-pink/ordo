import React from "react"
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
	ResponderProvided,
} from "react-beautiful-dnd"
import { FileMetadata, Folder } from "../../../../main/apis/fs/types"

const Card: React.FC<{
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

const Column: React.FC<{
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
