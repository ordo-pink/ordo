import React from "react";
import { HiOutlineDocumentAdd, HiOutlineFolderAdd } from "react-icons/hi";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { getCollapseIcon } from "@modules/file-explorer/utils/get-icon";

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
						dispatch({ type: "@file-explorer/toggle-folder", payload: tree.path });
					}}
				>
					<Icon />
					<div className="font-bold uppercase">{tree.readableName}</div>
				</div>
				<div className="flex items-center space-x-2">
					<HiOutlineDocumentAdd
						onClick={() => dispatch({ type: "@file-explorer/show-file-creation", payload: tree.path })}
						className="hover:text-pink-600 cursor-pointer"
					/>
					<HiOutlineFolderAdd
						onClick={() => dispatch({ type: "@file-explorer/show-folder-creation", payload: tree.path })}
						className="hover:text-pink-600 cursor-pointer"
					/>
				</div>
			</>
		)
	);
};
