import React from "react";

import { Sidebar } from "@containers/side-bar";
import { HorizontalSplit } from "@containers/split-view/horizontal-split";
import { Workspace } from "@containers/workspace";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { TopBar } from "@modules/top-bar";

import "@containers/main-area/index.css";

export const MainArea: React.FC = () => {
	const dispatch = useAppDispatch();

	const showSidebar = useAppSelector((state) => state.sideBar.show);
	const sideBarWidth = useAppSelector((state) => state.sideBar.width);
	const settingsSideBarWidth = useAppSelector((state) => state.app.internalSettings.window?.sideBarWidth);

	const [targetSideBarWidth, setTargetSideBarWidth] = React.useState<number>(sideBarWidth);
	const [sizes, setSizes] = React.useState<[number, number]>([100, 0]);

	const onSideBarDragEnd = React.useCallback(([l, r]) => dispatch({ type: "@side-bar/set-width", payload: r }), []);

	React.useEffect(() => {
		setSizes(showSidebar ? [100 - targetSideBarWidth, targetSideBarWidth] : [100, 0]);
	}, [showSidebar, targetSideBarWidth]);

	React.useEffect(() => {
		setTargetSideBarWidth(settingsSideBarWidth != null ? sideBarWidth : settingsSideBarWidth);
	}, [sideBarWidth, settingsSideBarWidth]);

	return (
		<div className="main-area">
			<TopBar />
			<HorizontalSplit sizes={sizes} snapOffset={200} onDragEnd={onSideBarDragEnd}>
				<Workspace />
				<Sidebar />
			</HorizontalSplit>
		</div>
	);
};
