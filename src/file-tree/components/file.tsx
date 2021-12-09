import type { OrdoFile } from "../types";

import React from "react";
import { tap, pipe, ifElse } from "ramda";
import {
	HiDocument,
	HiDocumentText,
	HiDocumentSearch,
	HiDocumentRemove,
	HiCog,
	HiPhotograph,
	HiExclamationCircle,
} from "react-icons/hi";

import { useAppDispatch, useAppSelector } from "../../common/state/hooks";
import { deleteFile, moveFile, setCurrentPath } from "../state/file-tree-slice";

import { Conditional } from "../../common/components/conditional";

const getIcon = (extension: string, size: number) => {
	if (extension === ".md") {
		return size > 0 ? HiDocumentText : HiDocument;
	}

	if (extension === ".png" || extension === ".jpg") {
		return HiPhotograph;
	}

	return HiDocumentSearch;
};

type FileProps = {
	file: OrdoFile;
	unsavedFiles: string[];
};

export const File: React.FC<FileProps> = ({ file, unsavedFiles }) => {
	const dispatch = useAppDispatch();

	const currentPath = useAppSelector((state) => state.fileTree.currentPath);

	const [newName, setNewName] = React.useState(file ? file.readableName : "");
	const [isEditing, setIsEditing] = React.useState(false);
	const [optionsVisible, setOptionsVisible] = React.useState(false);

	const Icon = getIcon(file.extension, file.size);
	const paddingLeft = `${(file.depth + 1) * 15}px`;
	const hasUnsavedContent = unsavedFiles.includes(file.path);
	const highlightCurrentFileClass = file.path === currentPath ? "bg-gray-300 dark:bg-gray-600" : "";

	const fileClickHandler = () => dispatch(setCurrentPath(file.path));
	const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value);
	const nameBlurHandler = () => {
		setIsEditing(false);
		setNewName(file.readableName);
	};
	const removeClickHandler = () => dispatch(deleteFile(file.path));
	const editClickHandler = () => setIsEditing(true);
	const fileMouseOverHandler = () => setOptionsVisible(true);
	const fileMouseLeaveHandler = () => setOptionsVisible(false);

	const isEnter = (e: KeyboardEvent) => e.key === "Enter";
	const isEsc = (e: KeyboardEvent) => e.key === "Escape";
	const preventDefault = tap((e: Event) => e.preventDefault());
	const resetName = tap(() => setNewName(file.readableName));
	const move = tap(() =>
		dispatch(
			moveFile({
				oldPath: file.path,
				newPath: file.path.replace(file.readableName, newName),
			}),
		),
	);
	const stopEditing = tap(() => setIsEditing(false));
	const noOp = tap((): null => null);

	const saveOnEnter = ifElse(isEnter, pipe(preventDefault, move, stopEditing), noOp);
	const dropOnEsc = ifElse(isEsc, pipe(preventDefault, resetName, stopEditing), noOp);
	const nameKeyDownHandler = pipe(saveOnEnter, dropOnEsc);

	return (
		file && (
			<div
				className={`w-full flex p-0.5 justify-between cursor-pointer pl-4 select-none truncate ${highlightCurrentFileClass}`}
				style={{ paddingLeft }}
				onClick={fileClickHandler}
				onMouseOver={fileMouseOverHandler}
				onMouseLeave={fileMouseLeaveHandler}
			>
				<div className="flex space-x-1">
					<div className="flex items-center flex-nowrap truncate">
						<Icon className={hasUnsavedContent ? "text-yellow-500" : "text-gray-500"} />
					</div>

					<Conditional when={!isEditing}>
						<div className="truncate">{file.readableName}</div>
						<input
							className="bg-transparent flex-grow p-0.5 outline-none leading-5"
							autoFocus={isEditing}
							value={newName}
							onChange={nameChangeHandler}
							onKeyDown={nameKeyDownHandler}
							onBlur={nameBlurHandler}
						/>
					</Conditional>
				</div>

				<div className="flex items-center space-x-2 pr-1 text-xs">
					<Conditional when={hasUnsavedContent}>
						<HiExclamationCircle className="text-yellow-500" />
					</Conditional>

					{optionsVisible && (
						<div className="flex space-x-2 items-center text-xs">
							<HiCog className="text-gray-500" onClick={editClickHandler} />
							<HiDocumentRemove className="text-red-500" onClick={removeClickHandler} />
						</div>
					)}
				</div>
			</div>
		)
	);
};
