import React from "react";
import { HiOutlineCog, HiOutlineShare, HiOutlineCollection } from "react-icons/hi";
import { setCurrentView } from "../redux/store";
import { CurrentView } from "../common/types";
import { useAppSelector, useAppDispatch } from "../redux/hooks";

export const SideBar: React.FC = () => {
	const currentView = useAppSelector((state) => state.currentView);
	const dispatch = useAppDispatch();

	const setView = (view: CurrentView) => (e: React.MouseEvent<HTMLOrSVGElement>) => {
		e.preventDefault();

		dispatch(setCurrentView(view));
	};

	return (
		<div className="flex flex-col items-center justify-between p-2">
			<div className="flex flex-col h-screen space-y-2">
				<div
					className={`text-3xl p-2 text-gray-500 hover:shadow-md transition-shadow rounded-lg ${
						currentView === "editor" && "text-pink-500"
					} cursor-pointer`}
				>
					<HiOutlineCollection onClick={setView("editor")} />
				</div>
				<div
					className={`text-3xl p-2 text-gray-500 hover:shadow-md transition-shadow rounded-lg ${
						currentView === "graph" && "text-pink-500"
					} cursor-pointer`}
				>
					<HiOutlineShare onClick={setView("graph")} />
				</div>
				<div
					className={`text-3xl  p-2 text-gray-500 hover:shadow-md transition-shadow rounded-lg ${
						currentView === "settings" && "text-pink-500"
					} cursor-pointer`}
				>
					<HiOutlineCog onClick={setView("settings")} />
				</div>
			</div>
		</div>
	);
};
