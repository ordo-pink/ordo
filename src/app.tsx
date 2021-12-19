import React from "react";
import Scrollbars from "react-custom-scrollbars";
import { HiOutlineCog, HiOutlineShare, HiOutlineCollection } from "react-icons/hi";

import { Editor } from "./editor/editor";

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

				<div className="flex flex-col items-center justify-between p-2 w-12 border-l border-gray-300 bg-gray-200">
					<div className="flex flex-col h-screen space-y-3">
						<div className="text-3xl text-pink-500 cursor-pointer">
							<HiOutlineCollection />
						</div>
						<div className="text-3xl text-gray-500 cursor-pointer">
							<HiOutlineShare />
						</div>
						<div className="text-3xl text-gray-500 cursor-pointer">
							<HiOutlineCog />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
