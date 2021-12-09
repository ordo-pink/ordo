import type { OrdoFolder, OrdoFile } from "../../../../file-tree/types";

import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { useAppDispatch, useAppSelector } from "../../../../common/state/hooks";
import {
	createFile,
	createFolder,
	deleteFile,
	deleteFolder,
	moveFile,
	moveFolder,
} from "../../../../file-tree/state/file-tree-slice";

import { Card } from "./card";
import { Conditional } from "../../../../common/components/conditional";

import { findNode } from "../../../../utils/tree";
import { escapeSlashes } from "../../../../utils/string";

export const Column: React.FC<{
	treePath: string;
	index: number;
}> = ({ treePath, index }) => {
	const dispatch = useAppDispatch();
	const rootTree = useAppSelector((state) => state.fileTree.tree) as OrdoFolder;

	const ref = React.useRef<HTMLDivElement>(null);

	const [tree, setTree] = React.useState<OrdoFolder>(null);
	const [isAddingCardAtTheTop, setIsAddingCardAtTheTop] = React.useState(false);
	const [isAddingCardAtTheBottom, setIsAddingCardAtTheBottom] = React.useState(false);
	const [newCardName, setNewCardName] = React.useState("");

	React.useEffect(() => {
		if (rootTree) {
			// setTree(findNode(rootTree, "path", treePath) as OrdoFolder);
		}
	}, [rootTree, treePath]);

	const newCardInputHasUnsavedChangesClass =
		!isAddingCardAtTheTop && Boolean(newCardName) && "border-yellow-700 text-yellow-700";
	const showNewCardInputHasUnsavedChanges = !isAddingCardAtTheTop && Boolean(newCardName);

	const newCardNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
		setNewCardName(e.target.value);
	const bottomCardInputClickHandler = () => setIsAddingCardAtTheBottom(true);
	const topCardInputClickHandler = () => setIsAddingCardAtTheTop(true);
	const clickRemoveColumnHandler = () => dispatch(deleteFolder(tree.path));
	const onBlur = () => {
		ref.current.textContent = tree.readableName;
		ref.current.blur();
		setIsAddingCardAtTheBottom(false);
		setIsAddingCardAtTheTop(false);
	};
	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();

			if (isAddingCardAtTheBottom || isAddingCardAtTheTop) {
				dispatch(createFile(`${tree.path}/${escapeSlashes(newCardName)}.md`));
				setNewCardName("");
			} else {
				dispatch(
					moveFolder({
						oldPath: tree.path,
						newPath: tree.path.replace(tree.readableName, escapeSlashes(ref.current.textContent)),
					}),
				);
			}
		}

		if (e.key === "Escape") {
			e.preventDefault();

			if (isAddingCardAtTheBottom || isAddingCardAtTheTop) {
				setNewCardName("");
				setIsAddingCardAtTheBottom(false);
				setIsAddingCardAtTheTop(false);
			} else {
				onBlur();
			}
		}
	};

	return (
		tree && (
			<Draggable draggableId={tree.path} index={index}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						className="bg-gray-200 dark:bg-gray-600 rounded-lg shadow-md flex flex-col pb-2 space-y-2"
						style={{ minWidth: "16rem", maxWidth: "16rem" }}
					>
						<div className="flex justify-between items-center p-2">
							<div
								className="text-center outline-none text-xs"
								ref={ref}
								contentEditable={true}
								suppressContentEditableWarning={true}
								onBlur={onBlur}
								onKeyDown={onKeyDown}
							>
								{tree.readableName}
							</div>

							<div className="flex space-x-2 items-center text-gray-500">
								<div
									className="text-xl hover:text-black cursor-pointer"
									title="Remove this column"
									onClick={clickRemoveColumnHandler}
								>
									⤫
								</div>

								<div
									className="text-xl hover:text-black"
									title="Hold to drag the column"
									{...provided.dragHandleProps}
								>
									𐄞
								</div>
							</div>
						</div>

						<Conditional when={isAddingCardAtTheTop}>
							<input
								className="rounded-lg outline-none mx-2 p-2 text-left text-xs text-gray-500 border border-dashed border-gray-500"
								autoFocus={isAddingCardAtTheTop}
								value={newCardName}
								onChange={newCardNameChangeHandler}
								onKeyDown={onKeyDown}
								onBlur={onBlur}
							/>
							<button
								className={`rounded-lg mx-2 p-2 text-left text-xs text-gray-500 border border-dashed border-gray-500 ${newCardInputHasUnsavedChangesClass}`}
								onClick={topCardInputClickHandler}
							>
								+ Add card
								<Conditional when={showNewCardInputHasUnsavedChanges}>
									<span className="ml-4">🟡</span>
								</Conditional>
							</button>
						</Conditional>

						<Droppable direction="vertical" droppableId={tree.path} type="card">
							{(provided) => (
								<div
									className="px-2 flex flex-col space-y-2 h-full"
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{tree.children &&
										tree.children.map((file, index) => (
											<div key={file.path}>
												{file.type !== "folder" && <Card file={file as OrdoFile} index={index} />}
											</div>
										))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>

						<Conditional when={tree.children && tree.children.length > 0}>
							<Conditional when={isAddingCardAtTheBottom}>
								<input
									className="rounded-lg outline-none mx-2 p-2 text-left text-xs text-gray-500 border border-dashed border-gray-500"
									autoFocus={isAddingCardAtTheBottom}
									value={newCardName}
									onChange={newCardNameChangeHandler}
									onKeyDown={onKeyDown}
									onBlur={onBlur}
								/>
								<button
									className={`rounded-lg mx-2 p-2 text-left text-xs text-gray-500 border border-dashed border-gray-500 ${newCardInputHasUnsavedChangesClass}`}
									onClick={bottomCardInputClickHandler}
								>
									+ Add card
									<Conditional when={showNewCardInputHasUnsavedChanges}>
										<span className="ml-4">🟡</span>
									</Conditional>
								</button>
							</Conditional>
						</Conditional>
					</div>
				)}
			</Draggable>
		)
	);
};
