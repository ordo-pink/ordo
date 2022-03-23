import React from "react";

import { getSupportedIcon } from "@core/apprearance/icons";
import { useAppDispatch } from "@core/state/hooks";
import { ActivityBarItem, selectActivity } from "./activity-bar-slice";

export const ActivityBarIcon: React.FC<ActivityBarItem & { current: boolean }> = ({ icon, show, name, current }) => {
	if (!show || !icon) {
		return null;
	}

	const dispatch = useAppDispatch();
	const Icon = getSupportedIcon(icon);
	const color = current ? "text-pink-600 hover:text-pink-800" : "text-neutral-400 hover:text-neutral-600";

	return (
		<Icon
			title={name}
			className={`cursor-pointer transition-all duration-500 ${color} select-none`}
			onClick={() => dispatch(selectActivity(name))}
		/>
	);
};
