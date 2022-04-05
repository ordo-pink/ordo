import { useAppSelector } from "@core/state/hooks";
import { findOrdoFile } from "@modules/file-explorer/file-tree/find-ordo-file";
import { getFileIcon } from "@utils/get-icon";
import React from "react";
import { HiOutlineFolder, HiFolder, HiChevronRight } from "react-icons/hi";

export const Breadcrumbs: React.FC = () => {
	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tabs = useAppSelector((state) => state.editor.tabs);
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	if (!tabs || !tree) {
		return null;
	}

	const tab = findOrdoFile(tree, currentTab);

	if (!tab) {
		return null;
	}

	const Icon = getFileIcon(tab);

	return (
		<div className="flex space-x-2 items-center px-4 py-2 select-none">
			{tab.relativePath.split("/").map((item) => (
				<div key={item} className="flex space-x-2 items-center">
					{item === "." ? (
						<HiOutlineFolder className="text-gray-500" />
					) : (
						<div className="flex items-center space-x-2">
							{item === tab.readableName ? <Icon className="text-gray-500" /> : <HiFolder className="text-gray-500" />}
							<div>{item}</div>
						</div>
					)}
					{item !== tab.readableName && <HiChevronRight className="text-gray-500" />}
				</div>
			))}
		</div>
	);
};
