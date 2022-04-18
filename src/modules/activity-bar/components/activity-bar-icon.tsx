import { getSupportedIcon } from "@core/appearance/icons";
import React from "react";
import { ActivityBarItem } from "../types";

export const ActivityBarIcon: React.FC<ActivityBarItem & { current: boolean }> = ({ icon, show, name, current }) => {
	if (!show || !icon) {
		return null;
	}

	const Icon = getSupportedIcon(icon);

	const color = current
		? "text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-600 focus:text-pink-800 dark:focus:text-pink-600"
		: "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-50 focus:text-neutral-600 dark:focus:text-neutral-50";

	return (
		<button
			tabIndex={2}
			className={`outline-none cursor-pointer transition-all duration-500 ${color} select-none`}
			onClick={() => window.ordo.emit("@activity-bar/select", name)}
		>
			<Icon title={name} className="outline-none" />
		</button>
	);
};
