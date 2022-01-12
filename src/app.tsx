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

export const App: React.FC = () => {
	const dispatch = useAppDispatch();

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
		};
	});

	return (
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
		</div>
	);
};
