import React from "react";

import { useAppDispatch } from "@core/state/store";
import { ActivityBarItem } from "@modules/activity-bar/types";
import { useIcon } from "@core/hooks/use-icon";
import { fromBoolean } from "@utils/either";
import { NoOp, noOpFn } from "@utils/no-op";

import "@modules/activity-bar/components/activity-bar-icon.css";

type ActivityBarItemProps = ActivityBarItem & { current: string };

export const ActivityBarIcon: React.FC<ActivityBarItemProps> = ({ icon, show, name, current }) => {
	const dispatch = useAppDispatch();

	const Icon = useIcon(icon);

	const [className, setClassName] = React.useState<string>("");

	const handleActivityClick = () => dispatch({ type: "@activity-bar/select", payload: name });

	React.useEffect(
		() =>
			fromBoolean(current === name).fold(
				() => setClassName(""),
				() => setClassName("current-activity"),
			),
		[current, name],
	);

	return fromBoolean(show).fold(NoOp, () => (
		<button tabIndex={2} className={`activity ${className}`} onClick={handleActivityClick} title={name}>
			<Icon />
		</button>
	));
};
