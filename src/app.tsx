import React from "react";

import { Editor } from "./editor/editor";
import { Explorer } from "./explorer/explorer";
import { useAppDispatch } from "./redux/hooks";
import { setState, State } from "./redux/store";
import { SideBar } from "./side-bar/side-bar";

export const App: React.FC = () => {
	const dispatch = useAppDispatch();

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
		<>
			<div className="flex h-full select-none">
				<div className="bg-gray-50 grow flex">
					<Editor />
				</div>
				<div className="break-normal bg-gray-100 border-l border-gray-300 pb-11">
					<Explorer />
				</div>

				<SideBar />
			</div>
		</>
	);
};
