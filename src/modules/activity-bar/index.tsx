import React from "react";

import { useAppSelector } from "@core/state/store";
import { ActivityBarIcon } from "@modules/activity-bar/components/activity-bar-icon";

export const ActivityBar: React.FC = () => {
	const items = useAppSelector((state) => state.activityBar.items);
	const current = useAppSelector((state) => state.activityBar.current);

	return (
		<div className="flex flex-col justify-between px-4 py-2 h-full text-4xl">
			<div className="flex flex-col space-y-4">
				{items.map((item) => (
					<ActivityBarIcon
						key={item.name}
						current={item.name === current}
						name={item.name}
						icon={item.icon}
						show={item.show}
					/>
				))}
			</div>
			<ActivityBarIcon current={current === "Settings"} name="Settings" icon="HiOutlineCog" show={true} />
		</div>
	);
};
