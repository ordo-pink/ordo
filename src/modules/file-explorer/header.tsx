import React from "react";
import { HiOutlineDocumentAdd, HiOutlineFolderAdd } from "react-icons/hi";

import { getCollapseIcon } from "@modules/application/get-folder-icon";
import { useAppSelector } from "@core/store-hooks";

export const Header: React.FC = () => {
	const tree = useAppSelector((state) => state.application.tree);

	const Icon = tree ? getCollapseIcon(tree) : () => null;

	if (!tree) {
		return null;
	}

	return (
		<>
			<div
				className="cursor-pointer flex space-x-2 items-center"
				onClick={() => {
					window.ordo.emit("@application/update-folder", [tree.path, { collapsed: !tree.collapsed }]);
				}}
			>
				<Icon />
				<div className="font-bold text-gray-600 uppercase">{tree.readableName}</div>
			</div>
			<div className="flex items-center space-x-2 text-gray-600">
				<HiOutlineDocumentAdd
					onClick={() => window.ordo.emit("@application/show-file-creation", tree.path)}
					className="hover:text-pink-600 cursor-pointer"
				/>
				<HiOutlineFolderAdd
					onClick={() => window.ordo.emit("@application/show-folder-creation", tree.path)}
					className="hover:text-pink-600 cursor-pointer"
				/>
			</div>
		</>
	);
};
