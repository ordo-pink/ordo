import React from "react";
import Scrollbars from "react-custom-scrollbars";
import { HiChevronDown, HiChevronRight, HiFolder, HiFolderOpen } from "react-icons/hi";
import { getFileIcon } from "../common/get-file-icon";
import { createTab } from "../editor/state";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getFolder, select, updateFolder } from "./state";
import { OrdoFile, OrdoFolder } from "./types";

const getCollapseIcon = (folder: OrdoFolder) => (folder.collapsed ? HiChevronRight : HiChevronDown);

const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const Icon = folder && getCollapseIcon(folder);
	const FolderIcon = folder.collapsed ? HiFolder : HiFolderOpen;

	const selected = useAppSelector((state) => state.explorer.selected);
	const dispatch = useAppDispatch();

	return (
		folder && (
			<>
				<div
					style={{ paddingLeft: folder.depth * 12 + "px" }}
					className={`flex space-x-2 items-center ${selected === folder.path && "bg-gray-300"}`}
					onClick={() => {
						dispatch(select(folder.path));
						dispatch(updateFolder({ path: folder.path, update: { collapsed: !folder.collapsed } }));
					}}
				>
					<Icon />
					<FolderIcon className={`text-gray-500 text-${folder.color}-500`} />
					<div className="pr-2 truncate text-gray-700 py-0.5">{folder.readableName}</div>
				</div>
				{!folder.collapsed &&
					folder.children.map((child) => (
						<div key={child.path}>
							{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
						</div>
					))}
			</>
		)
	);
};

const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	const Icon = getFileIcon(file);

	const selected = useAppSelector((state) => state.explorer.selected);
	const dispatch = useAppDispatch();

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 12 + "px" }}
			className={`flex space-x-2 items-center ${selected === file.path && "bg-gray-300"}`}
			onClick={() => {
				dispatch(select(file.path));
				dispatch(createTab(file));
			}}
		>
			<Icon className="shrink-0 text-gray-500" />
			<div className="pr-2 truncate text-gray-700 py-0.5">{file.readableName}</div>
		</div>
	);
};

export const Explorer: React.FC = () => {
	const dispatch = useAppDispatch();
	const tree = useAppSelector((state) => state.explorer.tree);
	const Icon = tree && getCollapseIcon(tree);

	React.useEffect(() => {
		dispatch(getFolder());
	}, []);

	return (
		tree && (
			<Scrollbars className="cursor-pointer relative">
				<div
					className="flex bg-gray-200 py-1 px-3 space-x-2 items-center"
					onClick={() => {
						dispatch(updateFolder({ path: tree.path, update: { collapsed: !tree.collapsed } }));
					}}
				>
					<Icon />
					<div className="font-bold text-gray-600 uppercase">{tree.readableName}</div>
				</div>
				<div>
					{!tree.collapsed &&
						tree.children.map((child) => (
							<div key={child.path}>
								{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
							</div>
						))}
				</div>
			</Scrollbars>
		)
	);
};
