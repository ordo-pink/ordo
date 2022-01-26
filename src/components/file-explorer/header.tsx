import React from "react";
import { HiOutlineDocumentAdd, HiOutlineFolderAdd } from "react-icons/hi";
import { getCollapseIcon } from "../../application/get-folder-icon";
import { useAppSelector } from "../../common/store-hooks";

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
					className="hover:text-pink-600 cursor-pointer"
					onClick={() => window.ordo.emit("@application/open-file-creator")}
				/>
				<HiOutlineFolderAdd
					className="hover:text-pink-600 cursor-pointer"
					onClick={() => window.ordo.emit("@application/open-folder-creator")}
				/>
			</div>
		</>
	);
};
