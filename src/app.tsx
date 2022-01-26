import React from "react";
import Split from "react-split";
import { Patch } from "immer";

import { ActivityBar } from "./containers/activity-bar/component";
import { Commander } from "./containers/commander/component";
import { Sidebar } from "./containers/sidebar/component";
import { Workspace } from "./containers/workspace/component";

import { WindowState } from "./common/types";
import { useAppDispatch, useAppSelector } from "./common/store-hooks";
import { applyPatches, setState } from "./common/store";

export const App: React.FC = () => {
	const dispatch = useAppDispatch();

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
		};
	});

	return (
		<div className="flex flex-col h-screen bg-gray-50">
			{showCommander ? (
				<div className="fixed w-full flex justify-center z-50">
					<div className="mt-10 w-[50%] bg-white rounded-lg shadow-xl">
						<Commander />
					</div>
				</div>
			) : null}
			<main className="flex flex-grow">
				<ActivityBar />
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
		</div>
	);
};
