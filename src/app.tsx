import React from "react";
import Split from "react-split";
import useMousetrap from "react-hook-mousetrap";

import { useAppDispatch, useAppSelector } from "@core/state/hooks";

import { Panel } from "@containers/panel";
import { Sidebar } from "@containers/sidebar";
import { StatusBar } from "@containers/status-bar";
import { Workspace } from "@containers/workspace";
import { setSidebarWidth, toggleSidebar } from "@containers/sidebar/sidebar-slice";

import { ActivityBar } from "@modules/activity-bar";
import { TopBar } from "@modules/top-bar";
import { setPanelHeight, togglePanel } from "@containers/panel/panel-slice";
import { openCommandPalette, openGoToFile, openGoToLine, openSearchInFile } from "@modules/top-bar/top-bar-slice";

export const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const showSidebar = useAppSelector((state) => state.sidebar.show);
	const sidebarWidth = useAppSelector((state) => state.sidebar.width);
	const showPanel = useAppSelector((state) => state.panel.show);
	const panelHeight = useAppSelector((state) => state.panel.height);

	useMousetrap(["command+shift+b", "ctrl+shift+b"], () => dispatch(toggleSidebar()));
	useMousetrap(["command+t command+t", "ctrl+t ctrl+t"], () => dispatch(togglePanel()));
	useMousetrap(["command+shift+p", "ctrl+shift+p"], () => dispatch(openCommandPalette()));
	useMousetrap(["command+f", "ctrl+f"], () => dispatch(openSearchInFile()));
	useMousetrap(["command+p", "ctrl+p"], () => dispatch(openGoToFile()));
	useMousetrap(["alt+g"], () => dispatch(openGoToLine()));

	return (
		<>
			<TopBar />
			<div className="flex h-[calc(100%-3.75rem)]">
				<ActivityBar />
				<Split
					className="flex select-none w-full h-full"
					sizes={showSidebar ? [100 - sidebarWidth, sidebarWidth] : [100, 0]}
					minSize={0}
					snapOffset={200}
					onDragEnd={(sizes) => dispatch(setSidebarWidth(sizes[1]))}
				>
					<Split
						className="flex flex-col justify-between"
						direction="vertical"
						sizes={showPanel ? [100 - panelHeight, panelHeight] : [100, 0]}
						minSize={0}
						snapOffset={100}
						onDragEnd={(sizes) => dispatch(setPanelHeight(sizes[1]))}
					>
						<Workspace />
						<div className="h-full shadow-xl rounded-t-xl bg-neutral-200  dark:bg-neutral-800">
							<Panel />
						</div>
					</Split>
					<div className="shadow-xl rounded-tl-xl mt-2 bg-neutral-200  dark:bg-neutral-800">
						<Sidebar />
					</div>
				</Split>
			</div>
			<div className="fixed bottom-0 left-0 right-0 bg-neutral-200  dark:bg-neutral-800">
				<StatusBar />
			</div>
		</>
	);
};
