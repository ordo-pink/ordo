import React from "react";

import { useAppDispatch } from "@core/state/store";
import { ActivityBarItem } from "@modules/activity-bar/types";
import { useIcon } from "@core/hooks/use-icon";

export const ActivityBarIcon: React.FC<ActivityBarItem & { current: boolean }> = ({ icon, show, name, current }) => {
	const dispatch = useAppDispatch();

	const Icon = useIcon(icon);

	const [className, setClassName] = React.useState<string>("");

	React.useEffect(() => {
		setClassName(
			current
				? "text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-600 focus:text-pink-800 dark:focus:text-pink-600"
				: "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-50 focus:text-neutral-600 dark:focus:text-neutral-50",
		);
	}, [current]);

	return show ? (
		<button
			tabIndex={2}
			className={`outline-none cursor-pointer transition-all duration-500 ${className} select-none`}
			onClick={() => dispatch({ type: "@activity-bar/select", payload: name })}
		>
			<Icon title={name} className="outline-none" />
		</button>
	) : null;
};
