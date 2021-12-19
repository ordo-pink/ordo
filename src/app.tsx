import React from "react";
import Scrollbars from "react-custom-scrollbars";

import { Editor } from "./editor/editor";

interface StatusBarItem {
	id: string;
	value: string;
	onClick: () => void;
}

export const App: React.FC = () => {
	// TODO: Move to redux
	const [status, setStatus] = React.useState<StatusBarItem[]>([]);

	const addStatus = (item: StatusBarItem) => setStatus([...status, item]);
	const removeStatus = (id: string) =>
		setStatus(
			[...status].splice(
				status.findIndex((i) => i.id === id),
				1,
			),
		);
	const updateStatus = (item: StatusBarItem) => {
		const oldItem = status.findIndex((i) => i.id === item.id);
		const copy = [...status];
		copy.splice(oldItem, 1, item);
		setStatus(copy);
	};

	return (
		<div>
			<div className="flex h-full">
				<div className="flex flex-col grow">
					<div className="flex items-center bg-gray-300">
						<div className="bg-gray-200 border-r border-gray-200 cursor-pointer px-3 py-1">Test.md</div>
					</div>
					<div className="bg-gray-50 grow pt-5">
						<Scrollbars>
							<Editor addStatus={addStatus} updateStatus={updateStatus} removeStatus={removeStatus} />
						</Scrollbars>
					</div>
				</div>

				<div className="flex flex-col items-center justify-between p-2 w-12 border-l border-gray-300 bg-gray-200">
					<div className="flex flex-col h-screen space-y-3">
						<div className="text-4xl cursor-pointer">📄</div>
						<div className="text-4xl cursor-pointer">🌲</div>
						<div className="text-4xl cursor-pointer">⚙️</div>
					</div>
				</div>
			</div>
			<div className="fixed left-0 right-0 bottom-0 flex justify-between items-center text-sm px-4 py-1 bg-gray-200 border-t border-gray-300">
				<div>
					{status.map((item) => (
						<span key={item.id} className="mr-4 cursor-pointer" onClick={item.onClick || (() => null)}>
							{item.value}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};
