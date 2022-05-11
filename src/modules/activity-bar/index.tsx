import React from "react";
import { Either } from "or-else";

import { useAppSelector } from "@core/state/store";
import { ActivityBarIcon } from "@modules/activity-bar/components/activity-bar-icon";
import { NoOp } from "@utils/no-op";

import "@modules/activity-bar/index.css";

export const ActivityBar: React.FC = () => {
	const items = useAppSelector((state) => state.activityBar.items);
	const current = useAppSelector((state) => state.activityBar.current);
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	return Either.fromNullable(tree)
		.chain((t) => Either.fromNullable(t.path))
		.fold(NoOp, () => (
			<div className="activity-bar">
				<div className="activity-bar-side-container">
					{items.map((item) => (
						<ActivityBarIcon key={item.name} current={current} name={item.name} icon={item.icon} show={item.show} />
					))}
				</div>
				<div className="activity-bar-side-section">
					<ActivityBarIcon current={current} name="Settings" icon="HiOutlineCog" show={true} />
				</div>
			</div>
		));
};
