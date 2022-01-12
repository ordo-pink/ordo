import React from "react";

import "./editor.css";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Scrollbars from "react-custom-scrollbars";
import { HiChevronRight, HiFolder, HiOutlineFolder, HiX } from "react-icons/hi";
import { OrdoFile } from "../explorer/types";
import { getFileIcon } from "../common/get-file-icon";
import { ImageViewer } from "./image-viewer";
import { TextEditor } from "./text-editor";
import { closeTab, openTab, select } from "../redux/store";
import { Either, Switch } from "or-else";
import { Welcome } from "./welcome-viewer";

const Breadcrumbs: React.FC = () => {
	const currentTab = useAppSelector((state) => state.currentTab);
	const tabs = useAppSelector((state) => state.tabs);

	if (!tabs || currentTab == null || !tabs[currentTab]) {
		return null;
	}

	const Icon = getFileIcon(tabs[currentTab]);

	return (
		tabs && (
			<div className="flex space-x-2 items-center px-4 py-2">
				{tabs.length > 0 &&
					tabs[currentTab].relativePath.split("/").map((item) => (
						<div key={item} className="flex space-x-2 items-center">
							{item === "." ? (
								<HiOutlineFolder className="text-gray-500" />
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
		)
	);
};

const Tab: React.FC<{ tab: OrdoFile; index: number }> = ({ tab, index }) => {
	const dispatch = useAppDispatch();

	const currentTab = useAppSelector((state) => state.currentTab);
	const tabs = useAppSelector((state) => state.tabs);
	const Icon = getFileIcon(tab);

	return (
		<div
			key={tab.path}
			className={`flex flex-shrink text-gray-800 dark:text-gray-300 items-center space-x-2 cursor-pointer px-3 py-1 rounded-lg truncate ${
				currentTab === index && "bg-gray-100 dark:text-gray-800 shadow-md"
			}`}
			onClick={() => {
				dispatch(openTab(index));
				dispatch(select(tabs[index].path));
			}}
		>
			<Icon className="text-gray-500" />
			<div>{tab.readableName}</div>
			<HiX
				className="text-gray-500 hover:text-red-500"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch(closeTab(index));

					if (index === currentTab) {
						dispatch(select(index > 0 ? tabs[index - 1].path : tabs.length > 1 ? tabs[index + 1].path : null));
					}
				}}
			/>
		</div>
	);
};

const Tabs: React.FC = () => {
	const tabs = useAppSelector((state) => state.tabs);

	return (
		<div className="flex items-center p-2 flex-wrap">
			{tabs && tabs.map((tab, index) => <Tab key={tab.path} tab={tab} index={index} />)}
		</div>
	);
};

export const Editor: React.FC = () => {
	const tabs = useAppSelector((state) => state.tabs);
	const currentTab = useAppSelector((state) => state.currentTab);

	const ViewComponent = Either.fromNullable(tabs)
		.chain((t) => Either.fromNullable(t[currentTab] ? t[currentTab] : null))
		.fold(
			() => Welcome,
			(f) => Switch.of(f.type).case("image", ImageViewer).default(TextEditor),
		);

	return (
		<div className="flex flex-col grow bg-gray-50 dark:bg-gray-700">
			<Tabs />
			<Scrollbars>
				<Breadcrumbs />
				<ViewComponent />
			</Scrollbars>
		</div>
	);
};
