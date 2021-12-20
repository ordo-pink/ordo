import React from "react";

import { Editor } from "./editor/editor";
import { Explorer } from "./explorer/explorer";
import { SideBar } from "./side-bar/side-bar";

export const App: React.FC = () => {
	return (
		<>
			<div className="flex h-full select-none">
				<div className="bg-gray-50 grow flex">
					<Editor />
					<div className="break-words bg-gray-100 border-l border-gray-300 pb-11">
						<Explorer />
					</div>
				</div>

				<SideBar />
			</div>
		</>
	);
};
