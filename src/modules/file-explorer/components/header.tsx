import { useAppDispatch, useAppSelector } from "@core/state/store";
import React from "react";
import { HiOutlineDocumentAdd, HiOutlineFolderAdd } from "react-icons/hi";
import { getCollapseIcon } from "../utils/get-icon";

export const Header: React.FC = () => {
	const dispatch = useAppDispatch();

	const tree = useAppSelector((state) => state.fileExplorer.tree);

	const Icon = tree ? getCollapseIcon(tree) : () => null;

	return (
		tree && (
			<>
				<div
					className="cursor-pointer flex space-x-2 items-center select-none"
					onClick={() => {
						dispatch({ "@file-explorer/toggle-folder": tree.path });
					}}
				>
					<Icon />
					<div className="font-bold uppercase">{tree.readableName}</div>
				</div>
				<div className="flex items-center space-x-2">
					<HiOutlineDocumentAdd
						onClick={() => dispatch({ "@file-explorer/show-file-creation": tree.path })}
						className="hover:text-pink-600 cursor-pointer"
					/>
					<HiOutlineFolderAdd
						onClick={() => dispatch({ "@file-explorer/show-folder-creation": tree.path })}
						className="hover:text-pink-600 cursor-pointer"
					/>
				</div>
			</>
		)
	);
};
