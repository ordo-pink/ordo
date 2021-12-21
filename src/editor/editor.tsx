import React from "react";

import "./editor.css";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Scrollbars from "react-custom-scrollbars";
import { closeTab, openTab } from "./state";
import { HiChevronRight, HiFolder, HiX } from "react-icons/hi";
import { OrdoFile } from "../explorer/types";
import { getFileIcon } from "../common/get-file-icon";
import { ImageViewer } from "./image-viewer";
import { TextEditor } from "./text-editor";

const Breadcrumbs: React.FC = () => {
	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tabs = useAppSelector((state) => state.editor.tabs);

	const Icon = getFileIcon(tabs[currentTab]);

	return (
		<div className="flex space-x-2 items-center px-4 py-2">
			{tabs.length > 0 &&
				tabs[currentTab].relativePath.split("/").map((item) => (
					<div key={item} className="flex space-x-2 items-center">
						{item === "." ? (
							<HiFolder className="text-gray-500" />
						) : (
							<div className="flex items-center space-x-2">
								{item === tabs[currentTab].readableName ? (
									<Icon className="text-gray-500" />
								) : (
									<HiFolder className="text-gray-500" />
								)}
								<div>{item}</div>
							</div>
						)}
						{item !== tabs[currentTab].readableName && <HiChevronRight className="text-gray-500" />}
					</div>
				))}
		</div>
	);
};

const Tab: React.FC<{ tab: OrdoFile; index: number }> = ({ tab, index }) => {
	const dispatch = useAppDispatch();
	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const Icon = getFileIcon(tab);

	return (
		<div
			key={tab.path}
			className={`flex flex-shrink items-center space-x-2 bg-gray-200 border-r border-gray-200 cursor-pointer px-3 py-1 truncate ${
				currentTab === index && "bg-pink-100"
			}`}
			onClick={() => dispatch(openTab(index))}
		>
			<Icon className="text-gray-500" />
			<div>{tab.readableName}</div>
			<HiX
				className="text-gray-500 hover:text-red-500"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch(closeTab(index));
				}}
			/>
		</div>
	);
};

const Tabs: React.FC = () => {
	const tabs = useAppSelector((state) => state.editor.tabs);

	return (
		<div className="flex items-center bg-gray-300">
			{tabs && tabs.map((tab, index) => <Tab key={tab.path} tab={tab} index={index} />)}
		</div>
	);
};

export const Editor: React.FC = () => {
	const tabs = useAppSelector((state) => state.editor.tabs);
	const currentTab = useAppSelector((state) => state.editor.currentTab);

	return (
		<div className="flex flex-col grow">
			<Tabs />

			{tabs && currentTab != null && tabs[currentTab] && (
				<Scrollbars>
					<Breadcrumbs />

					{tabs[currentTab].type === "image" ? <ImageViewer /> : <TextEditor />}
				</Scrollbars>
			)}
		</div>
	);
};
