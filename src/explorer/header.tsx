import React from "react";
import { HiOutlineDocumentAdd, HiOutlineFolderAdd } from "react-icons/hi";
import { getCollapseIcon } from "../common/get-folder-icon";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createFile, createFolder, updateFolder } from "./state";

export const Header: React.FC = () => {
	const dispatch = useAppDispatch();
	const tree = useAppSelector((state) => state.explorer.tree);
	const selected = useAppSelector((state) => state.explorer.selected);

	const Icon = tree && getCollapseIcon(tree);

	return (
		<>
			<div
				className="cursor-pointer flex space-x-2 items-center"
				onClick={() => {
					dispatch(updateFolder({ path: tree.path, update: { collapsed: !tree.collapsed } }));
				}}
			>
				<Icon />
				<div className="font-bold text-gray-600 uppercase">{tree.readableName}</div>
			</div>
			<div className="flex items-center space-x-2 text-gray-600">
				<HiOutlineDocumentAdd
					className="hover:text-pink-600 cursor-pointer"
					onClick={() => dispatch(createFile({ selectedPath: selected, path: "123.md" }))}
				/>
				<HiOutlineFolderAdd
					className="hover:text-pink-600 cursor-pointer"
					onClick={() => dispatch(createFolder({ selectedPath: selected, path: "123" }))}
				/>
			</div>
		</>
	);
};
