import React from "react";

import { Editor } from "./editor/editor";
import { Explorer } from "./explorer/explorer";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setState, State } from "./redux/store";
import { SideBar } from "./side-bar/side-bar";

export const App: React.FC = () => {
	const dispatch = useAppDispatch();

	const showExplorer = useAppSelector((state) => state.showExplorer);

	const onStateUpdate = ({ detail }: { detail: Partial<State> }) => {
		dispatch(setState(detail));
	};

	React.useEffect(() => {
		window.addEventListener("SetState", onStateUpdate as any);

		return () => {
			window.removeEventListener("SetState", onStateUpdate as any);
		};
	});

	return (
		<div className="flex h-screen select-none bg-gray-50 dark:bg-gray-700">
			<SideBar />
			<div className="grow flex">
				<Editor />

				{showExplorer && (
					<div className="break-normal pb-11 m-4 shadow-lg rounded-lg">
						<Explorer />
					</div>
				)}
			</div>
		</div>
	);
};
