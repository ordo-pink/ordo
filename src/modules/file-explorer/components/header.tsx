import { useAppSelector } from "@core/state/store";
import React from "react";
import { HiOutlineDocumentAdd, HiOutlineFolderAdd } from "react-icons/hi";
import { getCollapseIcon } from "../utils/get-icon";

export const Header: React.FC = () => {
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	const Icon = tree ? getCollapseIcon(tree) : () => null;

	if (!tree) {
		return null;
	}

	return (
		<>
			<div
				className="cursor-pointer flex space-x-2 items-center select-none"
				onClick={() => {
					window.ordo.emit("@file-explorer/toggle-folder", tree.path);
				}}
			>
				<Icon />
				<div className="font-bold uppercase">{tree.readableName}</div>
			</div>
			<div className="flex items-center space-x-2">
				<HiOutlineDocumentAdd
					onClick={() => window.ordo.emit("@file-explorer/show-file-creation", tree.path)}
					className="hover:text-pink-600 cursor-pointer"
				/>
				<HiOutlineFolderAdd
					onClick={() => window.ordo.emit("@file-explorer/show-folder-creation", tree.path)}
					className="hover:text-pink-600 cursor-pointer"
				/>
			</div>
		</>
	);
};
