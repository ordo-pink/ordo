import React from "react";
import Scrollbars from "react-custom-scrollbars";

import { Editor } from "./editor/editor";
import { SideBar } from "./side-bar/side-bar";

export const App: React.FC = () => {
	return (
		<>
			<div className="flex h-full">
				<div className="flex flex-col grow">
					<div className="flex items-center bg-gray-300">
						<div className="bg-gray-200 border-r border-gray-200 cursor-pointer px-3 py-1">Test.md</div>
					</div>
					<div className="bg-gray-50 grow pt-5">
						<Scrollbars>
							<Editor />
						</Scrollbars>
					</div>
				</div>

				<SideBar />
			</div>
		</>
	);
};
