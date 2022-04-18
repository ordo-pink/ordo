import React from "react";
import Split from "react-split";
import useMousetrap from "react-hook-mousetrap";

import { useAppDispatch, useAppSelector } from "@core/state/hooks";

import { Panel } from "@containers/panel";
import { Sidebar } from "@containers/sidebar";
import { StatusBar } from "@containers/status-bar";
import { Workspace } from "@containers/workspace";
import { setSidebarWidth, toggleSidebar } from "@containers/sidebar/sidebar-slice";
import { showSidebar as openSidebar } from "@containers/sidebar/sidebar-slice";
import { ActivityBar } from "@modules/activity-bar";
import { TopBar } from "@modules/top-bar";
import { setPanelHeight, togglePanel } from "@containers/panel/panel-slice";
import { openCommandPalette, openGoToFile, openGoToLine, openSearchInFile } from "@modules/top-bar/top-bar-slice";
import { selectActivity } from "@modules/activity-bar/activity-bar-slice";
import { selectProjectFolder } from "@modules/file-explorer/file-explorer-slice";

export const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const showSidebar = useAppSelector((state) => state.sidebar.show);
	const sidebarWidth = useAppSelector((state) => state.sidebar.width);
	const showPanel = useAppSelector((state) => state.panel.show);
	const panelHeight = useAppSelector((state) => state.panel.height);

	const filesUpdateListener = (data: any) => {
		// TODO: Watch for changes
	};

	React.useEffect(() => {
		window.addEventListener("@file-explorer/file-structure-updated", filesUpdateListener);

		return () => {
			window.removeEventListener("@file-explorer/file-structure-updated", filesUpdateListener);
		};
	}, []);

	useMousetrap(["command+shift+b", "ctrl+shift+b"], () => dispatch(toggleSidebar()));
	useMousetrap(["command+t command+t", "ctrl+t ctrl+t"], () => dispatch(togglePanel()));
	useMousetrap(["command+shift+p", "ctrl+shift+p"], () => dispatch(openCommandPalette()));
	useMousetrap(["command+f", "ctrl+f"], () => dispatch(openSearchInFile()));
	useMousetrap(["command+p", "ctrl+p"], () => dispatch(openGoToFile()));
	useMousetrap(["alt+g"], () => dispatch(openGoToLine()));
	useMousetrap(["command+shift+e", "ctrl+shift+e"], () => dispatch(selectActivity("Editor")));
	useMousetrap(["command+shift+g", "ctrl+shift+g"], () => dispatch(selectActivity("Graph")));
	useMousetrap(["command+,", "ctrl+,"], () => dispatch(selectActivity("Settings")));
	useMousetrap(["command+o", "ctrl+o"], () => {
		dispatch(selectProjectFolder());
		dispatch(selectActivity("Editor"));
		dispatch(openSidebar());
	});

	return (
		<>
			<TopBar />
			<div className="flex h-[calc(100%-3.75rem)]">
				<ActivityBar />
				<Split
					className="flex w-full h-full"
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
						<div className="h-full">
							<Workspace />
						</div>
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
