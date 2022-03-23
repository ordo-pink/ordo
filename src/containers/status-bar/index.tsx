import React from "react";

import { useAppSelector } from "@core/state/hooks";
import { StatusBarItem } from "./status-bar-slice";

export const StatusBarElement: React.FC<StatusBarItem> = ({ name, content }) => (
	<div className="hover:bg-gray-300 dark:hover:bg-gray-600 py-0.5 px-4 cursor-default" title={name}>
		{content}
	</div>
);

export const StatusBar: React.FC = () => {
	const items = useAppSelector((state) => state.statusBar.items);

	return (
		<div className="flex text-sm items-center">
			{items.map((item) => (
				<StatusBarElement key={item.name} name={item.name} content={item.content} />
			))}
		</div>
	);
};
