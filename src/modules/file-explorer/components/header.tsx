import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useFolderIcons } from "@modules/file-explorer/hooks/use-folder-icons";
import { useIcon } from "@core/hooks/use-icon";

export const Header: React.FC = () => {
	const dispatch = useAppDispatch();

	const tree = useAppSelector((state) => state.fileExplorer.tree);
	const { CollapseIcon } = useFolderIcons(tree);
	const HiOutlineDocumentAdd = useIcon("HiOutlineDocumentAdd");
	const HiOutlineFolderAdd = useIcon("HiOutlineFolderAdd");

	return (
		tree && (
			<>
				<div
					className="cursor-pointer flex space-x-2 items-center select-none"
					onClick={() => {
						dispatch({ type: "@file-explorer/toggle-folder", payload: tree.path });
					}}
				>
					<CollapseIcon />
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
