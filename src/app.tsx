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
	);
};
