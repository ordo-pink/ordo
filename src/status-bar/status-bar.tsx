import React from "react";

import { useAppSelector } from "../redux/hooks";

export const StatusBar: React.FC = () => {
	const statusBarLeft = useAppSelector((state) => state.statusBar.left);
	const statusBarRight = useAppSelector((state) => state.statusBar.right);

	return (
		<div className="fixed left-0 right-0 bottom-0 flex justify-between items-center text-sm px-1 py-1 bg-gray-200 border-t border-gray-300">
			<div>
				{statusBarLeft.map((item) => (
					<span key={item.id} className="mr-4 cursor-pointer" onClick={item.onClick || (() => null)}>
						{item.value}
					</span>
				))}
			</div>
			<div>
				{statusBarRight.map((item) => (
					<span key={item.id} className="mr-4 cursor-pointer" onClick={item.onClick || (() => null)}>
						{item.value}
					</span>
				))}
			</div>
		</div>
	);
};
