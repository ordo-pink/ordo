import { useAppDispatch, useAppSelector } from "@core/state/hooks";
import { findOrdoFile } from "@modules/file-explorer/file-tree/find-ordo-file";
import { getFileIcon } from "@utils/get-icon";
import { select } from "d3";
import React from "react";
import { HiX } from "react-icons/hi";
import { OrdoFile, openTab, closeTab } from "./editor-slice";

const Tab: React.FC<{ tab: OrdoFile }> = ({ tab }) => {
	const dispatch = useAppDispatch();

	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	if (!tree) {
		return null;
	}

	const file = findOrdoFile(tree, tab.path);

	if (!file) {
		return null;
	}

	const Icon = getFileIcon(tab);

	return (
		<div
			key={file.path}
			className={`flex flex-shrink text-sm text-gray-800 dark:text-gray-300 items-center space-x-2 cursor-pointer px-3 py-1 rounded-lg truncate ${
				currentTab === file.path && "bg-neutral-200 dark:bg-neutral-600 shadow-md"
			}`}
			onClick={() => {
				dispatch(openTab(file.path));
			}}
		>
			<Icon className="text-gray-500" />
			<div>{file.readableName}</div>
			<HiX
				className="text-gray-500 hover:text-red-500"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch(closeTab(file.path));
				}}
			/>
		</div>
	);
};

export const Tabs: React.FC = () => {
	const tabs = useAppSelector((state) => state.editor.tabs);

	return (
		<div className="flex items-center p-2 flex-wrap">
			{tabs && tabs.map((tab, index) => <Tab key={tab.path} tab={tab} />)}
		</div>
	);
};
