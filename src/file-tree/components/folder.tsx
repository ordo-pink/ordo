import type { OrdoFile, OrdoFolder } from "../types";

import React from "react";
import { ifElse, tap, pipe } from "ramda";
import {
	HiChevronDown,
	HiChevronRight,
	HiCog,
	HiDocumentRemove,
	HiFolder,
	HiFolderOpen,
	HiPlus,
} from "react-icons/hi";

import { useAppDispatch, useAppSelector } from "../../common/state/hooks";
import { toggleCreator } from "../../renderer/features/ui/ui-slice";
import { deleteFolder, moveFolder, updateFolder } from "../state/file-tree-slice";

import { Conditional } from "../../common/components/conditional";
import { File } from "./file";

type FolderProps = {
	folder?: OrdoFolder;
	unsavedFiles: string[];
};

export const Folder: React.FC<FolderProps> = ({ folder, unsavedFiles }) => {
	const dispatch = useAppDispatch();
	const rootFolder = useAppSelector((state) => state.fileTree.tree);
	const currentPath = useAppSelector((state) => state.fileTree.currentPath);

	const [name, setName] = React.useState("");
	const [isEditing, setIsEditing] = React.useState(false);
	const [optionsVisible, setOptionsVisible] = React.useState(false);

	const tree = folder ?? rootFolder;

	const Icon = tree && tree.collapsed ? HiChevronRight : HiChevronDown;
	const FolderIcon = tree && tree.collapsed ? HiFolder : HiFolderOpen;
	const subTreeVisibilityClass = tree && tree.collapsed ? "hidden" : "block";
	const hasCurrentlyOpenFileClass =
		tree && currentPath && tree.collapsed && currentPath.startsWith(tree.path)
			? "bg-gray-300 dark:bg-gray-600"
			: "";
	const paddingLeft = tree && `${(tree.depth + 1) * 10}px`;
	const canEdit = tree && rootFolder && tree.path !== rootFolder.path && !isEditing;

	React.useEffect(() => {
		tree && setName(tree.readablePath);
	}, [tree]);

	const toggleFolder = () =>
		dispatch(updateFolder({ folder: tree, increment: { collapsed: !tree.collapsed } }));

	const addClickHandler = () => dispatch(toggleCreator(tree));
	const removeClickHandler = () => dispatch(deleteFolder(tree.path));
	const editClickHandler = () => setIsEditing(true);
	const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
	const nameBlurHandler = () => {
		setIsEditing(false);
		setName(folder.readableName);
	};
	const folderMouseOverHandler = () => setOptionsVisible(true);
	const folderMouseLeaveHandler = () => setOptionsVisible(false);

	const isEnter = (e: KeyboardEvent) => e.key === "Enter";
	const isEsc = (e: KeyboardEvent) => e.key === "Escape";
	const preventDefault = tap((e: Event) => e.preventDefault());
	const resetName = tap(() => setName(folder.readableName));
	const move = tap(() =>
		dispatch(
			moveFolder({
				oldPath: tree.path,
				newPath: tree.path.replace(tree.readableName, name),
			}),
		),
	);
	const stopEditing = tap(() => setIsEditing(false));
	const noOp = tap((): null => null);

	const saveOnEnter = ifElse(isEnter, pipe(preventDefault, move, stopEditing), noOp);
	const dropOnEsc = ifElse(isEsc, pipe(preventDefault, resetName, stopEditing), noOp);
	const nameKeyDownHandler = pipe(saveOnEnter, dropOnEsc);

	return (
		tree && (
			<div className="cursor-pointer">
				<div
					className={`flex justify-between py-1 select-none ${hasCurrentlyOpenFileClass}`}
					style={{ paddingLeft }}
					onMouseOver={folderMouseOverHandler}
					onMouseLeave={folderMouseLeaveHandler}
				>
					<div className="flex space-x-1 flex-shrink">
						<div
							className="flex items-center flex-nowrap space-x-1 truncate"
							onClick={toggleFolder}
						>
							<Icon className="text-gray-500" />
							<FolderIcon className={`text-gray-500 ${`text-${tree.color}-500`}`} />
						</div>
						<Conditional when={!isEditing}>
							<div>{tree.readableName}</div>
							<input
								className="bg-transparent flex-grow p-0.5 outline-none leading-5"
								autoFocus={isEditing}
								value={name}
								onChange={nameChangeHandler}
								onKeyDown={nameKeyDownHandler}
								onBlur={nameBlurHandler}
							/>
						</Conditional>
					</div>

					{optionsVisible && (
						<div className="flex space-x-2 items-center pr-1 text-xs">
							<HiPlus className="text-gray-500" onClick={addClickHandler} />
							{canEdit && (
								<>
									<HiCog className="text-gray-500" onClick={editClickHandler} />
									<HiDocumentRemove className="text-red-500" onClick={removeClickHandler} />
								</>
							)}
						</div>
					)}
				</div>

				<div className={subTreeVisibilityClass}>
					{tree.children &&
						tree.children.map((fileOrFolder) => (
							<Conditional key={fileOrFolder.path} when={fileOrFolder.type === "folder"}>
								<Folder folder={fileOrFolder as OrdoFolder} unsavedFiles={unsavedFiles} />
								<File unsavedFiles={unsavedFiles} file={fileOrFolder as OrdoFile} />
							</Conditional>
						))}
				</div>
			</div>
		)
	);
};
