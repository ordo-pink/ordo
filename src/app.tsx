<<<<<<< HEAD
<<<<<<< HEAD
import { Either, Switch } from "or-else";
import { identity } from "ramda";
import React from "react";

import { Editor } from "./editor/editor";
import { Welcome } from "./editor/welcome-viewer";
import { Explorer } from "./explorer/explorer";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setState, State } from "./redux/store";
import { SideBar } from "./side-bar/side-bar";

const EditorView: React.FC = () => {
	const showExplorer = useAppSelector((state) => state.showExplorer);

	return (
		<>
			<Editor />

			{showExplorer && (
				<div className="break-normal pb-8 m-4 mb-10 shadow-lg rounded-lg">
					<Explorer />
				</div>
			)}
		</>
	);
};

const GraphView: React.FC = () => <h1>Here will be graph soon!</h1>;

const SettingsView: React.FC = () => <h1>Here will be settings soon!</h1>;
=======
import React from "react";
import Split from "react-split";
import { Patch } from "immer";

import { ActivityBar } from "@containers/activity-bar/component";
import { Commander } from "@containers/commander/component";
import { Sidebar } from "@containers/sidebar/component";
import { Workspace } from "@containers/workspace/component";
import { WindowState } from "@core/types";
import { useAppDispatch, useAppSelector } from "@core/store-hooks";
import { applyPatches, setState } from "@core/store";
>>>>>>> ordo/main

export const App: React.FC = () => {
	const dispatch = useAppDispatch();

<<<<<<< HEAD
	const statusBar = useAppSelector((state) => state.statusBar) || [];
	const currentView = useAppSelector((state) => state.currentView);

	const onStateUpdate = ({ detail }: { detail: Partial<State> }) => {
		dispatch(setState(detail));
	};

	const Component = Either.fromNullable(currentView != null ? currentView : null)
		.map((cv) => Switch.of(cv).case("graph", GraphView).case("settings", SettingsView).default(EditorView))
		.fold(() => Welcome, identity);

	React.useEffect(() => {
		window.addEventListener("SetState", onStateUpdate as any);

		return () => {
			window.removeEventListener("SetState", onStateUpdate as any);
=======
	const sidebarWidth = useAppSelector((state) => state.sidebar.width);
	const showCommander = useAppSelector((state) => state.commander.show);

	React.useEffect(() => {
		window.ordo.emit("@application/get-state");
	}, []);

	const handleSetState = ({ detail }: CustomEvent<WindowState>) => {
		dispatch(setState(detail));
	};

	const handlePatchState = ({ detail }: CustomEvent<Patch[]>) => {
		dispatch(applyPatches(detail));
	};

	React.useEffect(() => {
		window.addEventListener("apply-state-patches", handlePatchState as (e: Event) => void);
		window.addEventListener("set-state", handleSetState as (e: Event) => void);

		return () => {
			window.removeEventListener("apply-state-patches", handlePatchState as (e: Event) => void);
			window.removeEventListener("set-state", handleSetState as (e: Event) => void);
>>>>>>> ordo/main
		};
	});

	return (
<<<<<<< HEAD
		<div className="flex h-screen select-none bg-gray-50 dark:bg-gray-700">
			<SideBar />
			<div className="flex grow">
				<Component />
			</div>
			<div className="fixed right-2 bottom-2 text-sm text-gray-500">
				{statusBar.map((status) => (
					<div>{status}</div>
				))}
			</div>
=======
		<div className="flex flex-col h-screen bg-gray-50">
			{showCommander ? (
				<div
					className="fixed w-full flex justify-center z-50 top-0 left-0 right-0 bottom-0"
					onClick={() => window.ordo.emit("@commander/hide")}
				>
					<div className="mt-10 w-[50%] h-fit bg-white rounded-lg shadow-xl">
						<Commander />
					</div>
				</div>
			) : null}
			<main className="flex flex-grow">
				<div className="z-40 bg-gray-50">
					<ActivityBar />
				</div>
				<Split
					sizes={[100 - sidebarWidth, sidebarWidth]}
					minSize={0}
					snapOffset={100}
					className="flex select-none w-full"
					onDragEnd={(sizes) => window.ordo.emit("@sidebar/set-width", sizes[1])}
				>
					<div className="w-full">
						<Workspace />
					</div>

					<div className="z-40">
						<div className="p-2 h-full">
							<div className="shadow-lg rounded-lg h-full bg-gray-100">
								<Sidebar />
							</div>
						</div>
					</div>
				</Split>
			</main>
>>>>>>> ordo/main
		</div>
=======
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
>>>>>>> ordo-app/main
	);
};
