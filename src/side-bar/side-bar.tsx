import React from "react";
import { HiOutlineCog, HiOutlineShare, HiOutlineCollection } from "react-icons/hi";

export const SideBar: React.FC = () => {
	return (
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
	);
};
